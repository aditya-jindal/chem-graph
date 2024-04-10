from graph import Graph
import networkx as nx
import numpy as np


class BasicValues():
    def __init__(self, file, testing=False):
        obj = Graph(file, testing=testing)
        self.graph = obj.get_graph()
        self.num_edges = self.graph.number_of_edges()
        self.num_vertices = self.graph.number_of_nodes()
        self.dist_matrix = nx.floyd_warshall_numpy(
            self.graph, nodelist=sorted(self.graph.nodes))
        self.degree = dict(self.graph.degree)
        self.edge_list = list(self.graph.edges)
        