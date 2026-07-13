
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
    def __init__(self, iFileHeaderArray, oFileHeaderArray, data, filename):
        self.IHeader = iFileHeaderArray
        self.OHeader = oFileHeaderArray
        self.Data = data
        self.Filename = filename


    def process_file(self):

        for line in self.Data:
            pass
