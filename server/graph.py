import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import os
# from pyvis.network import Network
import json


class Graph():

    def __init__(self, file, textarea_data, testing=False):
        self.testing = testing
        self.file = file
        self.textarea_data = textarea_data
        self.graph = self.create_graph()
        # self.plot_graph()

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

    def conect_to_str(self, conectList):
        newList = [' '.join(map(str, list)) for list in conectList]
        return newList

    def conect_list(self):
        if self.is_txt():
            return self.conect_to_str(self.read_txt_file())
        elif self.is_mol():
            return self.read_mol_v2()

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
        mapping = {old_label: new_label for new_label, old_label in enumerate(G.nodes(), 1)}
        G = nx.relabel_nodes(G, mapping)
        return G

    def get_graph(self):
        return self.graph

    def read_mol_v2(self):
        self.file.seek(0)
        lines = self.file.readlines()
        atom_count = int(lines[3][0:3].strip())
        bond_count = int(lines[3][3:6].strip())
        atom_lines = lines[4:4 + atom_count]
        adjacency_list = [[] for i in range(atom_count)]
        bond_lines = lines[4 + atom_count:4 + atom_count + bond_count]
        for bond in bond_lines:
            atom1 = int(bond[0:3].strip())  
            atom2 = int(bond[3:6].strip())
            adjacency_list[atom1-1].append(atom2)
            adjacency_list[atom2-1].append(atom1)
        adjacency_list = [" ".join(map(str, [index+1] + item)) for index, item in enumerate(adjacency_list)]
        return adjacency_list

    def read_mol_v3(self):
        self.file.seek(0)
        lines = self.file.readlines()
        atom_count = int(lines[5].split()[3])
        bond_count = int(lines[5].split()[4])
        atom_start = None
        atom_end = None
        for index, line in enumerate(lines):
            if line.startswith(b"M  V30 BEGIN ATOM"):
                atom_start = index + 1
            elif line.startswith(b"M  V30 END ATOM"):
                atom_end = index
                break
        atom_lines = lines[atom_start:atom_end]
        adjacency_list = [[] for i in range(atom_count)]       
        bond_start = None
        bond_end = None
        for index, line in enumerate(lines):
            if line.startswith(b"M  V30 BEGIN BOND"):
                bond_start = index + 1
            elif line.startswith(b"M  V30 END BOND"):
                bond_end = index
                break
        bond_lines = lines[bond_start:bond_end]
        for bond in bond_lines:
            parts = bond.split()
            atom1 = int(parts[4])  
            atom2 = int(parts[5]) 
            adjacency_list[atom1-1].append(atom2)
            adjacency_list[atom2-1].append(atom1)
        adjacency_list = [" ".join(map(str, [index+1] + item)) for index, item in enumerate(adjacency_list)]
        return adjacency_list

    def plot_graph(self):
        pos = nx.spring_layout(self.graph)
        nx.draw(self.graph, pos, with_labels=True, node_size=700)
        plt.show()
        return True
    
    # def get_graph_plot(self):
    #     nt = Network('500px', '500px')
    #     nt.from_nx(self.graph)
    #     html_str = nt.write_html('temp.html')
    #     with open('temp.html', 'r') as f:
    #         html_str = f.read()
    #     return html_str
