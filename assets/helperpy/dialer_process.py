from pathlib import Path
from datetime import date
import requests

TIME_ZONE = {
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

class Dialer:
    def __init__(self, data, filename, config, business_line):
        self.IHeader = None
        self.OHeader = config.getDialerHeader(business_line)
        self.output_folder = config.getDialerOutputDirectory()
        self.archive_folder = config.getDialerArchiveDirectory()
        self.Data = data
        self.Filename = filename
        self.Business_line = business_line
        self.RecordArray = []
        self.ErrorArray = []

    def __get_state_with_zip(self, zip):
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

    def __archive_file(self):

        text = '\n'.join(line.rstrip('\r\n') for line in self.Data.splitlines() if line)
        Path(self.archive_folder, self.Filename).write_text(data=text, newline='')

    def __write_error_file(self):
        text = ''
        print(self.Data)
        for record in self.ErrorArray:
            text += ','.join(record['error']) + '\n'

        current_date = date.today().strftime('%Y%m%d')
        Path(f"{self.output_folder}ERROR_{self.Business_line}_{current_date}.csv").write_text(data=text)


    def __write_files(self):
        if self.Business_line == 'CRI':
            text = ",".join([r.replace('RecordNumber', 'AccountNumber') for r in self.OHeader]) + '\n'

            for record in self.RecordArray:
                record['AccountNumber'] = record.pop('RecordNumber')
                reordered_record = {key: record[key] for key in self.OHeader if key in record or key == 'RecordNumber'}
                text += ','.join(reordered_record.values()) + '\n'

            current_date = date.today().strftime('%Y%m%d')
            Path(f"{self.output_folder}{self.Business_line}_{current_date}.csv").write_text(data=text)
            # Write the Error and Archive File.
            self.__write_error_file()
            self.__archive_file()

    def process_file(self):
        lines = self.Data.splitlines()
        self.IHeader = lines[0].split(',')

        if self.IHeader:
            r = 0
            for line in lines[1:]:
                records = line.split(',')
                if(len(records) != len(self.IHeader)):
                    self.ErrorArray.append({ 'error': records })
                else:
                    self.RecordArray.append(
                        { self.IHeader[i]: records[i] for i in range(len(self.IHeader)) }
                    )
                    self.__prepare_for_output(self.RecordArray[r])
                    if self.RecordArray[r]['ZONE'] is None:
                        self.ErrorArray.append({ 'error': records })
                        self.RecordArray.pop(r)
                    r+=1

            if len(self.RecordArray) > 0:
                self.__write_files()

        return {'result': True}


    def __get_timezone(self, state):
        return TIME_ZONE[state]

    def __get_state_and_zip(self,state_and_zip):
        fields = state_and_zip.split(' ')
        return fields

    def __prepare_for_output(self, record):
        if len(record['StateandZip']) > 1:
            state = self.__get_state_and_zip(record['StateandZip'])[0]
            zip = self.__get_state_and_zip(record['StateandZip'])[1]

            if state is None:
                return

            zone = self.__get_timezone(state.upper())
            del record['StateandZip']
            record['ZONE'] = zone
            record['State'] = state
            record['Zip'] = zip
