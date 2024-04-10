from columnA import ColumnA
import os

file_path = os.path.join('data','FAR23.pdb')
file = open(file_path, 'r')

test_instance = ColumnA(file, testing=True)

print(test_instance.get_values())
print('hello world')

file.close()