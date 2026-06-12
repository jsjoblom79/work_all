from datetime import datetime
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, scoped_session
from assets.models.vendor_models import Base, Vendors, Contacts, Comments, Invoices, Products, ProductPrices
from assets.repositories.vendor_repo import VendorRepo

class VendorAPI:
    def __init__(self, config):
        try:
            self.engine = create_engine(config.getConnectionString("Vendors"))
            self.session = sessionmaker(bind=self.engine, expire_on_commit=False)
            self.db = scoped_session(self.session)
            Base.metadata.create_all(self.engine)

        except Exception as e:
            print(e)
            raise

        self.repo = VendorRepo(self.db)

    def get_all_vendors(self):
        ''' Gets all vendors and returns dictionaries. '''
        vendors = self.repo.get_all(Vendors)
        return [
            vendor.to_dict() for vendor in vendors
        ]

    def get_vendor(self, vendor_id):
        vendor =  self.repo.get_by_model_id(Vendors, vendor_id)
        if vendor:
            return vendor.to_dict()
        else:
            return None

    def add_vendor(self, vendor):
        ''' Adds a vendor. '''
        new_vendor = Vendors(**vendor)
        result = self.repo.add(new_vendor)
        if result[0]:
            return {'result': result[0], 'vendor': result[1].to_dict()}
        else:
            return {'result': result[0], 'vendor': result[1]}

    def update_vendor(self, vendor):
        print(vendor)
        updated_vendor = Vendors(**vendor)
        result = self.repo.update(updated_vendor)
        if result[0]:
            return {'result': result[0], 'vendor': result[1].to_dict()}
        else:
            return {'result': result[0], 'vendor': result[1]}