from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy import Integer, Text, DateTime, Boolean, text, ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Tasks(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    create_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    followup_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    last_followup: Mapped[Optional[datetime]] = mapped_column(DateTime)
    is_complete: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=False, server_default=text('0'))

    notes: Mapped[list['Notes']] = relationship('Notes', back_populates='task', cascade='all, delete-orphan')
    time_tracking: Mapped[list['TimeTracking']] = relationship('TimeTracking', back_populates='task', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'create_date': self.create_date.isoformat() if self.create_date else None,
            'followup_date': self.followup_date.isoformat() if self.followup_date else None,
            'last_followup': self.last_followup.isoformat() if self.last_followup else None,
            'is_complete': self.is_complete,
            'time_tracking': self.get_all_task_duration(),
        }

    def get_all_task_duration(self):
        duration = timedelta()
        for time in self.time_tracking:
            if time.end_time is not None:
                duration += time.end_time - time.start_time
        if duration.total_seconds() > 0:
            return str(duration).split('.')[0]
        return None


class Notes(Base):
    __tablename__ = 'notes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    note: Mapped[Optional[str]] = mapped_column(Text)
    create_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id'), nullable=False)

    task: Mapped['Tasks'] = relationship('Tasks', back_populates='notes')

    def to_dict(self):
        return {
            'id': self.id,
            'note': self.note,
            'create_date': self.create_date.isoformat() if self.create_date else None,
            'task_id': self.task_id,
        }

class TimeTracking(Base):
    __tablename__ = 'time_tracking'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id'), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now())
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime)

    task: Mapped['Tasks'] = relationship('Tasks', back_populates='time_tracking')

    def to_dict(self):
        return {
            'id': self.id,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'task_id': self.task_id,
            #'total_time': self.end_time - self.start_time,
        }

    def get_task_duration(self):
        duration = timedelta()
        duration += self.end_time - self.start_time
        return duration