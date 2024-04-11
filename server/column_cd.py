from four_columns import FourColumns
import networkx as nx
import numpy as np


class ColumnCD(FourColumns):
    def __init__(self, file, testing=False):
        super().__init__(file, testing=testing)
        
        self.m_plus_weighted, self.m_minus_weighted, self.m_mul_weighted, self.m_square_plus_weighted = self.compute_m_values()
        self.matrices = self.compute_matrices(
            self.m_plus_weighted, self.m_minus_weighted, self.m_mul_weighted, self.m_square_plus_weighted)
        self.degree_indices = self.compute_degree_indices()
        self.entropy_indices = self.compute_entropy_indices()

    def compute_m_values(self):
        adjacency_list = nx.to_dict_of_lists(self.graph)
        weighted_G_dict = {i: sum([self.graph.degree(
            node) for node in neighbours]) for i, neighbours in adjacency_list.items()}
        weighted_G = nx.Graph()
        for node in self.graph.nodes():
            weighted_G.add_node(node, weight=weighted_G_dict[node])
        for edge in self.edge_list:
            weighted_G.add_edges_from([edge])
        weight_edge_list = np.array(
            [[weighted_G.nodes[i]['weight'], weighted_G.nodes[j]['weight']] for (i, j) in self.edge_list])

        m_plus_weighted = weight_edge_list[:, 0] + weight_edge_list[:, 1]
        m_minus_weighted = weight_edge_list[:, 0] - weight_edge_list[:, 1]
        m_mul_weighted = weight_edge_list[:, 0] * weight_edge_list[:, 1]
        m_square_plus_weighted = weight_edge_list[:,
                                                  0] ** 2 + weight_edge_list[:, 1] ** 2

        return m_plus_weighted, m_minus_weighted, m_mul_weighted, m_square_plus_weighted

    def get_values(self):
        return {"columnC: Degree Sum Indices": self.degree_indices, "columnD: Degree Sum Entropy": self.entropy_indices}
