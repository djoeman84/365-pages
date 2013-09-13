#CSV to JSON converter
import sys
import json

def parse_to_new_tree(zipCode, zipCodeEntry):
	if (zipCode == ''):
		return zipCodeEntry
	first_dig = int(zipCode[0])
	return {first_dig:parse_to_new_tree(zipCode[1:], zipCodeEntry)}

def parse_to_tree(d, zipCode, zipCodeEntry):
	first_dig = int(zipCode[0])
	if first_dig in d:
		parse_to_tree(d[first_dig], zipCode[1:],zipCodeEntry)
	else:
		d[first_dig] = parse_to_new_tree(zipCode[1:],zipCodeEntry)


if __name__ == '__main__':
	args = sys.argv
	if (len(args) < 2):
		print 'Incorrect usage: please supply at least one argument specifying the input csv\nThe second optional argument specifies the name of the output json file'
	json_source = args[1]
	json_target = json_source.replace('csv','json')
	if (len(args) > 2):
		json_target = args[2]
		if (json_target.find('.json') == -1):
			json_target += '.json'

	f = open(json_source, 'r')
	json_source_str = f.read()
	f.close()

	zip_json = json.loads(json_source_str)

	tree_dict = {'data':{}}
	for zip_dict in zip_json['data']:
		if 'zip' not in zip_dict:
			continue
		parse_to_tree(d = tree_dict['data'], zipCode = zip_dict['zip'], zipCodeEntry = zip_dict)

	f = open(json_target, 'w')
	f.write(json.dumps(tree_dict))
	f.close()



