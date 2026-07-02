from sqlalchemy import create_engine, inspect, select, func
from sqlalchemy.orm import sessionmaker, scoped_session
from assets.models.task_models import Tasks, TimeTracking, Notes, Base
from assets.repositories.task_repo import TaskRepo
from datetime import datetime

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
        return [ task.to_dict() for task in self.db.scalars(select(Tasks)).all()]

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
        total_time = 0
        for time in results:
            if time.end_time != None:
                time_instance = time.end_time - time.start_time
                total_time += time_instance

        return total_time

    def get_all_tracked_times(self):
        stmt = select(TimeTracking)
        tracked_times =  self.db.scalars(stmt).all()
        total_time = 0
        for time in tracked_times:
            if time.end_time != None:
                time_instance = time.end_time - time.start_time
                total_time += time_instance

        return total_time

    def get_task_stats(self):
        tasks = self.db.query(Tasks).all()
        completed_tasks = 0

        for task in tasks:
            if task.is_complete:
                completed_tasks += 1
        return [
            {'key': 'Total Tasks', 'value': len(tasks)},
            {'key': 'Completed Tasks', 'value': completed_tasks},
            { 'key': 'Total Time Spent', 'value': self.get_all_tracked_times()}
        ]

    def add_task(self, task):
        print(task)
        new_task = Tasks(**task)
        result = self.repo.add(new_task)
        if result[0]:
            return {'result': result[0], 'task': result[1].to_dict()}
        else:
            print(result[1])
            return {'result': result[0], 'task': result[1]}

    def add_note(self, note):
        new_note = Notes(**note)
        result = self.repo.add(new_note)
        if result[0]:
            return {'result': result[0], 'note': result[1].to_dict()}
        else:
            return {'result': result[0], 'note': result[1]}

    def add_time_tracked(self, time_tracking):
        new_time_tracking = TimeTracking(**time_tracking)
        result = self.repo.add(new_time_tracking)
        if result[0]:
            return {'result': result[0], 'time_tracking': result[1].to_dict()}
        else:
            return {'result': result[0], 'time_tracking': result[1]}

    def update_time_tracked(self, id):
        stmt = select(TimeTracking).where(TimeTracking.task_id == id, TimeTracking.end_time == None)
        time_tracked = self.db.scalars(stmt)
        print(time_tracked)
        time_tracked.end_time = datetime.now()
        result = self.repo.update(time_tracked)
        if result[0]:
            return {'result': result[0], 'time_tracked': result[1].to_dict()}
        else:
            return {'result': result[0], 'time_tracked': result[1]}

