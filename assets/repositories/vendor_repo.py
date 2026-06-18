import logging

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


class VendorRepo:
    def __init__(self, session):
        self.session = session

    def add(self, item):
        """Insert a row. Returns (success: bool, item_or_None)."""
        try:
            self.session.add(item)
            self.session.commit()
            self.session.refresh(item)
            return True, item
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error("add failed: %s", e)
            return False, None

    def delete(self, item):
        """Delete a row. Returns True on success, False otherwise."""
        try:
            self.session.delete(item)
            self.session.commit()
            return True
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error("delete failed: %s", e)
            return False

    def update(self, model):
        """Merge/update a row. Returns (success: bool, merged_or_None)."""
        try:
            merged = self.session.merge(model)
            self.session.commit()
            return True, merged
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error("update failed: %s", e)
            return False, None

    def get_all(self, model):
        """Return a list of all rows for model, or [] on error."""
        try:
            stmt = select(model)
            return self.session.scalars(stmt).all()
        except SQLAlchemyError as e:
            logger.error("get_all failed: %s", e)
            return []

    def get_by_model_id(self, model, id):
        """Return a single row by primary key, or None if missing/error."""
        try:
            return self.session.get(model, id)
        except SQLAlchemyError as e:
            logger.error("get_by_model_id failed: %s", e)
            return None

    def get_vendor_contacts(self, model, parent_id):
        """Return rows where model.vendor_id == parent_id, or [] on error."""
        try:
            stmt = select(model).where(model.vendor_id == parent_id)
            return self.session.scalars(stmt).all()
        except SQLAlchemyError as e:
            logger.error("get_all_children failed: %s", e)
            return []

    def get_all_products(self, model, parent_id):
        """Return rows where model.product_id == parent_id, or [] on error."""
        try:
            stmt = select(model).where(model.vendor_id == parent_id)
            return self.session.scalars(stmt).all()
        except SQLAlchemyError as e:
            logger.error("get_all_product_children failed: %s", e)
            return []

    def get_all_notes(self, model, parent_id):
        """Return all rows of notes for vendor."""
        try:
            stmt = select(model).where(model.vendor_id == parent_id)
            return self.session.scalars(stmt).all()
        except SQLAlchemyError as e:
            logger.error("get_all_notes failed: %s", e)
            return []