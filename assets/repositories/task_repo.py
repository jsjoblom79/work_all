from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError


class TaskRepo:
    def __init__(self, session):
        self.session = session

    def add(self, item):
        try:
            self.session.add(item)
            self.session.commit()
            self.session.refresh(item)
            return True, item
        except SQLAlchemyError as e:
            self.session.rollback()
            return False, e

    def update(self, item):
        try:
            merged = self.session.merge(item)
            self.session.commit()
            return True, merged
        except SQLAlchemyError as e:
            self.session.rollback()
            return False, e