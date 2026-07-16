import json


class RpedFile:
    def __init__(self, filename, data):
        self.filename = filename
        self.data = data,
        with open('./assets/config/rped_config.json') as file:
            self.config = json.load(file)

        self.output_folder = self.config['output_folder']
        self.archive_folder = self.config['archive_folder']
        self.output_format = self.config['output_format']
        self.records = []
        self.errors = []

    def process_file(self):
        lines = self.data[0].splitlines()
        header = lines[0].split(',')
        if header:
            for line in lines[1:]:
                records = line.split(',')
                if len(records) != len(header):
                    self.errors.append({'errors': records })

                else:
                    self.records.append(
                        { header[i].replace('"',''): records[i].replace('"','') for i in range(len(header)) }
                    )


        if len(self.records) > 0:
            print(self.output_format)
            print(len(self.records))