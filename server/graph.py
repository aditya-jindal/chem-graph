import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import os
from rdkit import Chem
from pyvis.network import Network
import json


class Graph():

    def __init__(self, file, textarea_data, testing=False):
        self.testing = testing
        self.file = file
        self.textarea_data = textarea_data
        self.graph = self.create_graph()

    def is_txt(self):
        if self.testing:
            _, file_extension = os.path.splitext(self.file.name)
        else:
            _, file_extension = os.path.splitext(self.file.filename)

        return file_extension == '.txt'

    def is_mol(self):
        if self.testing:
            _, file_extension = os.path.splitext(self.file.name)
        else:
            _, file_extension = os.path.splitext(self.file.filename)

        return file_extension == '.mol'

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

    def read_mol_file(self):
        try:
            self.file.seek(0)
            mol_block = self.file.read().decode('utf-8')
            mol = Chem.MolFromMolBlock(mol_block, sanitize=False)
            if not mol:
                print("Failed to load .mol file content.")
                return None

            num_atoms = mol.GetNumAtoms()
            adj_matrix = np.zeros((num_atoms, num_atoms), dtype=int)
            for bond in mol.GetBonds():
                i = bond.GetBeginAtomIdx()
                j = bond.GetEndAtomIdx()
                adj_matrix[i, j] = 1
                adj_matrix[j, i] = 1

            return adj_matrix

        except Exception as e:
            print(f"An error occurred while reading .mol file: {e}")
            return None

    def conect_to_str(self, conectList):
        newList = [' '.join(map(str, list)) for list in conectList]
        return newList

    def conect_list(self):
        if self.is_txt():
            return self.conect_to_str(self.read_txt_file())
        elif self.is_mol():
            adj_matrix = self.read_mol_file()
            if adj_matrix is None:
                return None
            G = nx.from_numpy_array(adj_matrix)
            return nx.generate_adjlist(G)

        return self.conect_to_str(self.read_pdb_file())

    def create_graph(self):
        if self.textarea_data:
            adjacency_list = json.loads(self.textarea_data)
            G = nx.Graph()
            for node, neighbors in adjacency_list.items():
                for neighbor in neighbors:
                    G.add_edge(int(node), neighbor)
            return G
        conect_list = self.conect_list()
        if conect_list is None:
            return None
        G = nx.parse_adjlist(conect_list, nodetype=int)
        return G

    def get_graph(self):
        return self.graph

    def get_graph_plot(self):
        nt = Network('500px', '500px')
        nt.from_nx(self.graph)
        html_str = nt.write_html('temp.html')
        with open('temp.html', 'r') as f:
            html_str = f.read()
        return html_str
