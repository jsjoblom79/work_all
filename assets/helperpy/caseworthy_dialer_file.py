import csv
from datetime import datetime


TIMEZONE = {
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





if __name__ == "__main__":
    filePath = "C:\\Users\\sjoblomj\\Documents\\IT_Department\\Projects\\Active_Projects\\CaseWorthy - Grant w ENMU-R\\Accounts\\RPED_Dialer_07012026.csv"
    outputFile = f"C:\\Users\\sjoblomj\\Documents\\IT_Department\\Projects\\Active_Projects\\CaseWorthy - Grant w ENMU-R\\Accounts\\RPED_Dialer_{datetime.now().strftime('%Y%m%d')}.csv"
    data = []
    with open(filePath, "r") as file:
        csvreader = csv.DictReader(file)
        header = next(csvreader)

        for row in csvreader:
            row["Phone"] = (
                row["Phone"].replace("(", "").replace(")", "").replace(" ", "").replace("-", "")
            )
            if len(row["Phone"]) >= 7:
                data.append(row)
            state = row['State']
            print(state)
            
            try:
                row["ZONE"] = TIMEZONE[state]
            except KeyError:
                row["ZONE"] = ''
    header = [
        "Last_Name",
        "First_Name",
        "School_ID",
        "DOB",
        "High_School_Attended",
        "Hours_Completed",
        "Certificate_or_Degree",
        "Online_Hours",
        "In_Person_Hours",
        "College_GPA",
        "Phone",
        "Address",
        "City",
        "State",
        "Zip",
        "ZONE",
    ]
    with open(outputFile, "w", newline="") as file:
        csvwriter = csv.DictWriter(file, fieldnames=header)
        csvwriter.writeheader()
        csvwriter.writerows(data)
