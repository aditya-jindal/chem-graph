import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import os


class Graph():

    def __init__(self, file, testing=False):
        self.testing = testing
        self.file = file
        self.G = self.create_graph()

    def is_txt(self):
        if self.testing:
            _, file_extension = os.path.splitext(self.file.name) 
        else:          
            _, file_extension = os.path.splitext(self.file.filename)

        return file_extension == '.txt'

    def read_pdb_file(self):
        try:
            self.file.seek(0)
            lines = self.file.readlines()
            conect_str = 'CONECT' if self.testing else b'CONECT'
            conect_list = [list(map(int, line[6:].split()))
                           for line in lines if line[0:6] == conect_str]

            return conect_list

        except Exception as e:
            print(f"An error occurred: {e}")

            return None

    def read_txt_file(self):
        try:
            self.file.seek(0)
            lines = self.file.readlines()
            conect_list = [list(map(int, line.split())) for line in lines]
            list_with_index = []
            for i in range(len(conect_list)):
                temp_list = [i + 1] + conect_list[i]
                list_with_index.append(temp_list)
            return list_with_index
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def conect_to_str(self, conectList):
        newList = [' '.join(map(str, list)) for list in conectList]
        return newList

    def conect_list(self):
        if self.is_txt():
            return self.conect_to_str(self.read_txt_file())

        return self.conect_to_str(self.read_pdb_file())

    def create_graph(self):
        G = nx.parse_adjlist(self.conect_list(), nodetype=int)
        return G

    def get_graph(self):
        return self.G
    
