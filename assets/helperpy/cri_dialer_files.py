""" 
    This is the current dialer script used to convert files recieved from CRI
    Common issues are comma's in fields specifically the Client Name and debtor name
    fields. There are also typically additional fields that are not used.
"""
from pathlib import Path
import os
import requests
from datetime import date, datetime


class DialerFile:
    def __init__(self, filepath = None):
        """ initialize the Dialer File Class. 
        
            Parameters 
            filepath the input file that should be processed
        """
        self.filepath = filepath
        self.header_row = []
        self.records = []
        self.new_header_row = []

    def __get_state(self, state_and_zip):
        
        state_zip = state_and_zip.split(' ')
        try:
            if len(state_zip[0]) > 2:
                return get_state_with_zip(state_zip[1])
            else:
                return state_zip[0]
        except IndexError:
            return ''

    def __get_zip(self, state_and_zip):
        zip = state_and_zip.split(' ')
        try:
            if len(zip[1]) > 5:
                return zip[1][:5]
            return zip[1]
        except IndexError:
            return ''
            
    def __adjust_file_records(self):
        """Set fields that aren't in the file natively"""
        zip, state = '', ''
        
        for record in self.records:
            #debtor_name = f"{record['FirstName']} {record['LastName']}"
            if len(record['StateandZip']) > 1:
                state = self.__get_state(record['StateandZip'])
                zip = self.__get_zip(record['StateandZip'])
            zone = get_timezone(state)
            #record['DebtorName'] = debtor_name
            record['State'] = state
            record['Zip'] = zip
            record['ZONE'] = zone
            # if len(record['TotalOutCalls']) < 1:
            #     record['TotalOutCalls'] = str(0)
        
    def read_dialer_file(self):
        """ Read the file and produce a data set and set the header row """
        
        lines = Path(self.filepath).read_text().splitlines()
        self.header_row = [r.replace('"','') for r in lines[0].split(',')]
      
        # self.header_row = [r.replace('"','') for r in self.header_row]
        print(self.header_row)
        # Loop through the list to read the fields
        for line in lines[1:]:
            i = int(0)
            fields = {}
            # split the line into fields and read each field to a dictionary.
            for field in line.split(','):
                try:
                    fields[f"{self.header_row[i]}"] = field
                    i += 1
                except IndexError as e:
                    print(f"Error occured on record {line}, {str(e)}")
            self.records.append(fields)

        self.__adjust_file_records()

    def get_header_row(self):
        return [
                'RecordNumber',
                'DebtorName',
                'StAddress1',
                'City',
                'State',
                'Zip',
                'Phone',
                'DebtorTotalDue',
                'DateOfReferral',
                'DateofService',
                'StatusCode',
                'CollectorNumber',
                'ClientNumber',
                'ClientName',
                'ZONE',
                ]
    
time_zone = {
    'AL': 'CST6CDT',
    'AK': 'America/Anchorage',
    'AZ': 'MST7MDT',
    'AR': 'CST6CDT',
    'CA': 'PST8PDT',
    'CO': 'MST7MDT',
    'CT': 'EST5EDT',
    'DE': 'EST5EDT',
    'DC': 'EST5EDT',
    'FL': 'CST6CDT',
    'GA': 'EST5EDT',
    'HI': 'HST',
    'ID': 'MST7MDT',
    'IL': 'CST6CDT',
    'IN': 'EST5EDT',
    'IA': 'CST6CDT',
    'KS': 'MST7MDT',
    'KY': 'EST5EDT',
    'LA': 'CST6CDT',
    'ME': 'EST5EDT',
    'MD': 'EST5EDT',
    'MA': 'EST5EDT',
    'MI': 'EST5EDT',
    'MN': 'CST6CDT',
    'MS': 'CST6CDT',
    'MO': 'CST6CDT',
    'MT': 'MST7MDT',
    'NE': 'MST7MDT',
    'NV': 'PST8PDT',
    'NH': 'EST5EDT',
    'NJ': 'EST5EDT',
    'NM': 'MST7MDT',
    'NY': 'EST5EDT',
    'NC': 'EST5EDT',
    'ND': 'CST6CDT',
    'OH': 'EST5EDT',
    'OK': 'CST6CDT',
    'OR': 'PST8PDT',
    'PA': 'EST5EDT',
    'RI': 'EST5EDT',
    'SC': 'EST5EDT',
    'SD': 'CST6CDT',
    'TN': 'CST6CDT',
    'TX': 'CST6CDT',
    'UT': 'MST7MDT',
    'VT': 'EST5EDT',
    'VA': 'EST5EDT',
    'WA': 'PST8PDT',
    'WV': 'EST5EDT',
    'WI': 'CST6CDT',
    'WY': 'MST7MDT',
}

def get_timezone(abrv):
    try:
        return time_zone[abrv]
    except KeyError:
        return ''
    
def is_us_state(abrv):
    
    try:
        if time_zone[abrv]:
            return True
    except KeyError:
        return False


def get_state_with_zip(zip):
    """ This method will return the state using a zip code."""
    url = f'http://ziptasticAPI.com/{zip}'
    try:
        
        response = requests.get(url)
        if response.status_code == 200:
            response_dict = response.json()
            try:
                return response_dict['state']
            except KeyError:
                return ''
    except Exception:
        return ''

# Directory Constants
INPUT_DIR = "//nmeaf.org/files/IT_Processes/CRI/Dialer_File/input/"
OUTPUT_DIR = "//nmeaf.org/files/IT_Processes/CRI/Dialer_File/output/"

current_date = date.today().strftime('%Y%m%d')
new_file = Path(f"{OUTPUT_DIR}CRI_Dialer_{current_date}.csv")
error_file = Path(f"{OUTPUT_DIR}Errors_CRI_Dialer_{current_date}.csv")

def get_dialer_file_path(origfile):
    new_file = Path(f"{OUTPUT_DIR}{origfile}_{current_date}.csv")
    return new_file

def write_dialer_files(errorfilepath, records, origfile):
    """ write the dialer file """
    dialer = DialerFile()
    # writes the header row for the file
    text = ",".join([r.replace('RecordNumber', 'AccountNumber') for r in dialer.get_header_row()]) + "\n"
    #text.replace("RecordNumber", "AccountNumber")
    errors = ",".join(dialer.get_header_row()) + "\n"
    no_go_clients = [] # ['1027','836','232','99999']
    

    for items in records:
        # Loops through the records to create the row for the file.
        #time.sleep(1)
        
        for record in items:
            # This line filters out records that are not needed, by clientnumber the no_go_clients. This can also
            # be changed to include the clients.
            values = [record[key] for key in dialer.get_header_row() if key in record and record['ClientNumber'] not in no_go_clients]
            if len(values) > 1:
                separator = ','
                if is_us_state(record['State']):
                    text += separator.join(values) + "\n"
                else:
                    errors += separator.join(values) + "\n"
    
    
    get_dialer_file_path(origfile).write_text(data=text)
    errorfilepath.write_text(data=errors)
    print("File has been created.")

def parse_dos(v):
    return datetime.strptime(v, "%m/%d/%Y")


if __name__ == '__main__':
    # Create a list to contain all the dictionaries
    print(f'The dialer input file should be located here {INPUT_DIR}')
    result = input("Please enter yes/no to continue: ")
    print(result)
    if result.lower() == "yes":
        master_files = []
        current_file_name = None
        with os.scandir(path=INPUT_DIR) as files:
            for file in files:
                current_file_name = file.name[0:-4]
                
                if not file.is_dir():
                    print(f"processing {file.name}")
                    dialer = DialerFile(file.path)
                    dialer.read_dialer_file()
                    master_files.append(dialer.records)
                write_dialer_files(error_file, master_files, current_file_name)
                master_files.clear()
    else:
        print('You have requested to stop.')
        print('No file will be processed.\n')
        print('Hit any key to exit\n')
        exitResult = input()
        

