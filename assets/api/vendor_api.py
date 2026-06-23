from datetime import datetime
from unittest import result

from sqlalchemy import create_engine, inspect, select
from sqlalchemy.orm import sessionmaker, scoped_session
from assets.models.vendor_models import Base, Vendors, Contacts, Comments, Invoices, Products, InvoiceItems
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

    def get_all_notes(self, vendorId):
        ''' Gets all notes and returns dictionaries. '''
        notes = self.repo.get_all_notes(Comments, vendorId)
        return [note.to_dict() for note in notes]

    def get_all_invoices(self, vendorId):
        ''' Gets all invoices and returns dictionaries. '''
        invoices = self.repo.get_all_invoices(Invoices, vendorId)
        return [ invoice.to_dict() for invoice in invoices]

    def get_vendor(self, vendor_id):
        vendor =  self.repo.get_by_model_id(Vendors, vendor_id)
        if vendor:
            return vendor.to_dict()
        else:
            return None

    def get_product_by_id(self, productId):
        product = self.repo.get_by_model_id(Products, productId)
        if product:
            return product.to_dict()
        else:
            return None

    def get_invoice_by_vendor(self, vendorId):
        stmt = select(Invoices).where(Invoices.vendor_id == vendorId)
        results = self.db.execute(stmt).all()
        return [invoice.to_dict() for invoice in results]

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

    def add_product(self, product):
        ''' Adds a product. '''
        new_product = Products(**product)
        result = self.repo.add(new_product)

        if result[0]:
            return {'result': result[0], 'product': result[1].to_dict()}
        else:
            return {'result': result[0], 'product': result[1]}

    def add_note(self, note):
        ''' Adds a note. '''
        new_note = Comments(**note)
        result = self.repo.add(new_note)
        if result[0]:
            return {'result': result[0], 'note': result[1].to_dict()}
        else:
            return {'result': result[0], 'note': result[1]}

    def add_invoice(self, invoice):
        ''' Adds a invoice. '''
        new_invoice = Invoices(**invoice)
        for column in inspect(Invoices).mapper.column_attrs:
            if 'date' in column.key:
                value = getattr(new_invoice, column.key)
                if value:
                    setattr(new_invoice, column.key, parse_datetime(value))
        results = self.repo.add(new_invoice)
        if results[0]:
            return {'result': results[0], 'invoice': results[1].to_dict()}
        else:
            return {'result': results[0], 'invoice': results[1]}

    def add_invoice_item(self, invoice_item):
        ''' Adds a invoice product. '''
        new_invoice_item = InvoiceItems(**invoice_item)

        results = self.repo.add(new_invoice_item)
        if results[0]:
            return {'result': results[0], 'invoiceItem': results[1].to_dict()}
        else:
            return {'result': results[0], 'invoiceItem': results[1]}

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

    def update_product(self, product):
        updated_product = Products(**product)
        for column in inspect(Products).mapper.column_attrs:
            if 'date' in column.key:
                value = getattr(updated_product, column.key)
                if value:
                    setattr(updated_product, column.key, parse_datetime(value))
        result = self.repo.update(updated_product)
        if result[0]:
            return {'result': result[0], 'product': result[1].to_dict()}
        else:
            return {'result': result[0], 'product': result[1]}