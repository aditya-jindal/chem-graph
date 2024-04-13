from column_ab import ColumnAB
from column_cd import ColumnCD
from column_e import ColumnE
import os

file_path = os.path.join('data','FAR23.pdb')
file = open(file_path, 'r')

test_instance = ColumnE(file, testing=True)

print(test_instance.get_distance_indices())
print('hello world')

file.close()