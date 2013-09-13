#CSV to JSON converter
import csv
import sys
import json



if __name__ == '__main__':
	args = sys.argv
	if (len(args) < 2):
		print 'Incorrect usage: please supply at least one argument specifying the input csv\nThe second optional argument specifies the name of the output json file'
	csv_file = args[1]
	json_file = csv_file.replace('csv','json')
	if (len(args) > 2):
		json_file = args[2]
		if (json_file.find('.json') == -1):
			json_file += '.json'

	with open(csv_file, 'rb') as csvf:
		json_raw = {'data':[]}
		csv_reader = csv.reader(csvf, delimiter=',')
		headers = csv_reader.next()
		print headers
		for row in csv_reader:
			row_dict = {}
			for i, cell in enumerate(row):
				row_dict[headers[i]] = cell
			json_raw['data'].append(row_dict)
		json_str = json.dumps(json_raw)
		f = open(json_file, 'w')
		f.write(json_str)
		f.close()

