from sqlalchemy import create_engine, inspect, select, func
from sqlalchemy.orm import sessionmaker, scoped_session

from assets.helperpy.helper_functions import parse_datetime
from assets.models.task_models import Tasks, TimeTracking, Notes, Base
from assets.repositories.task_repo import TaskRepo
from datetime import datetime, timedelta

class TasksApi:
    def __init__(self, config):
        try:
            self.engine = create_engine(config.getConnectionString("Tasks"))
            self.session = sessionmaker(bind=self.engine, expire_on_commit=False)
            self.db = scoped_session(self.session)
            Base.metadata.create_all(self.engine)

        except Exception as e:
            print(e)
            raise

        self.repo = TaskRepo(self.db)

    def get_all_tasks(self):
        stmt = select(Tasks).where(Tasks.is_complete == False)
        tasks = self.db.scalars(stmt).all()
        return [ task.to_dict() for task in tasks]

    def get_all_uncompleted_tasks(self):
        stmt = select(Tasks).where(Tasks.is_complete == False).order_by(Tasks.followup_date.desc()).limit(5)
        tasks = self.db.scalars(stmt).all()
        uTasks = []
        for task in tasks:
            uTasks.append(
                {'key': task.title, 'value': task.followup_date.isoformat() if task.followup_date else None, 'is_link': False},
            )

        return uTasks

    def get_task_by_id(self, task_id)-> dict:
        stmt = select(Tasks).where(Tasks.id == task_id)
        result = self.db.scalars(stmt).first()
        if result:
            return result.to_dict()
        else:
            return {'task': None}

    def get_task_notes(self, task_id):
        notes = self.db.scalars(select(Notes).where(Notes.task_id == task_id)).all()
        return [note.to_dict() for note in notes]

    def get_tracked_time_by_task(self, task_id):
        stmt = select(TimeTracking).where(TimeTracking.task_id == task_id)
        results = self.db.scalars(stmt).all()
        duration = timedelta()
        for time in results:
            if time.end_time is not None:
                duration += time.end_time - time.start_time

        total_duration = str(duration).split('.')[0]
        return {'taskTime': total_duration}

    def get_all_tracked_times(self):
        stmt = select(TimeTracking)
        tracked_times =  self.db.scalars(stmt).all()
        duration=timedelta()
        for time in tracked_times:
            if time.end_time is not None:
                duration += time.end_time - time.start_time
        total_duration = str(duration).split('.')[0]
        print(total_duration)
        return {'allTime': total_duration }

    def get_completed_tasks(self):
        stmt = select(Tasks).where(Tasks.is_complete == True)
        tasks = self.db.scalars(stmt).all()
        return [task.to_dict() for task in tasks]

    def get_task_stats(self):
        tasks = self.db.query(Tasks).all()
        trackedTime = self.get_all_tracked_times()
        completed_tasks = self.get_completed_tasks()
        return [
            {'key': 'Total Tasks', 'value': len(tasks), 'is_link': False},
            {'key': 'Completed Tasks', 'value': len(completed_tasks), 'is_link': True},
            { 'key': 'Total Time Spent', 'value': trackedTime['allTime'], 'is_link': False}
        ]

    def add_task(self, task):
        print(task)
        new_task = Tasks(**task)
        for column in inspect(new_task).mapper.column_attrs:
            if 'date' in column.key:
                value = getattr(new_task, column.key)
                if value:
                    setattr(new_task, column.key, parse_datetime(value))
        result = self.repo.add(new_task)

        if result[0]:
            return {'result': result[0], 'task': result[1].to_dict()}
        else:
            print(result[1])
            return {'result': result[0], 'task': str(result[1])}

    def add_note(self, note):
        new_note = Notes(**note)
        result = self.repo.add(new_note)
        if result[0]:
            return {'result': result[0], 'note': result[1].to_dict()}
        else:
            return {'result': result[0], 'note': result[1]}

    def add_time_tracked(self, taskId):
        newStartTime = TimeTracking (
            task_id=taskId,
            start_time=datetime.now()
        )
        result = self.repo.add(newStartTime)
        if result[0]:
            return {'result': result[0], 'time_tracking': result[1].to_dict()}
        else:
            return {'result': result[0], 'time_tracking': str(result[1])}

    def update_task(self, task):
        currentTask = Tasks(**task)
        for column in inspect(currentTask).mapper.column_attrs:
            if 'date' in column.key:
                value = getattr(currentTask, column.key)
                if value:
                    setattr(currentTask, column.key, parse_datetime(value))
            if 'last_followup' in column.key:
                value = getattr(currentTask, column.key)
                if value:
                    setattr(currentTask, column.key, parse_datetime(value))

        result = self.repo.update(currentTask)

        if result[0]:
            return {'result': result[0], 'task': result[1].to_dict()}
        else:
            print(result[1])
            return {'result': result[0], 'task': str(result[1])}

    def update_time_tracked(self, id):
        stmt = select(TimeTracking).where(TimeTracking.task_id == id, TimeTracking.end_time == None)
        time_tracked = self.db.scalars(stmt).one_or_none()
        print(time_tracked.start_time)
        time_tracked.end_time = datetime.now()
        result = self.repo.update(time_tracked)
        if result[0]:
            return {'result': result[0], 'time_tracked': result[1].to_dict()}
        else:
            return {'result': result[0], 'time_tracked': result[1]}


    def delete_task(self, taskId):
        task_to_delete = self.db.get(Tasks, taskId)
        if task_to_delete:
            self.db.delete(task_to_delete)
            self.db.commit()
            return {'result': True }
        else:
            return {'result': False}