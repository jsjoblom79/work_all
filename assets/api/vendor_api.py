from datetime import datetime
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, scoped_session
from assets.models.vendor_models import Base, Vendors, Contacts, Comments, Invoices, Products, ProductPrices
from assets.repositories.vendor_repo import VendorRepo
from assets.helperpy.helper_functions import parse_datetime

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
        return [ vendor.to_dict() for vendor in vendors ]

    def get_all_contacts(self, vendorId):
        ''' Gets all contacts and returns dictionaries. '''
        contacts = self.repo.get_vendor_contacts(Contacts, vendorId)
        return [ contact.to_dict() for contact in contacts]

    def get_all_products(self, vendorId):
        ''' Gets all products and returns dictionaries. '''
        products = self.repo.get_all_products(Products, vendorId)
        return [ product.to_dict() for product in products]

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

    def add_contact(self, contact):
        ''' Adds a contact. '''
        new_contact = Contacts(**contact)
        result = self.repo.add(new_contact)
        if result[0]:
            return {'result': result[0], 'contact': result[1].to_dict()}
        else:
            return {'result': result[0], 'contact': result[1]}

    def update_vendor(self, vendor):
        updated_vendor = Vendors(**vendor)
        for column in inspect(Vendors).mapper.column_attrs:
            if 'date' in column.key:
                value  = getattr(updated_vendor, column.key)
                if value:
                    setattr(updated_vendor, column.key, parse_datetime(value))
                    
        result = self.repo.update(updated_vendor)
        if result[0]:
            return {'result': result[0], 'vendor': result[1].to_dict()}
        else:
            return {'result': result[0], 'vendor': result[1]}

    def update_contact(self, contact):
        updated_contact = Contacts(**contact)
        for column in inspect(Contacts).mapper.column_attrs:
            if 'date' in column.key:
                value = getattr(updated_contact, column.key)
                if value:
                    setattr(updated_contact, column.key, parse_datetime(value))
        result = self.repo.update(updated_contact)
        if result[0]:
            return {'result': result[0], 'contact': result[1].to_dict()}
        else:
            return {'result': result[0], 'contact': result[1]}