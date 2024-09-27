from basic_values import BasicValues
import numpy as np
import networkx as nx


class FourColumns(BasicValues):
    def __init__(self, file, testing=False):
        super().__init__(file, testing=testing)

    def compute_matrices(self, m_plus, m_minus, m_mul, m_square_plus):
        matrices = {
            "first_zagreb": m_plus,
            "second_zagreb": m_mul,
            "randić": 1 / np.sqrt(m_mul),
            "atom_bond_connectivity": np.sqrt((m_plus - 2) / m_mul),
            "harmonic": 2 / m_plus,
            "sum_connectivity": 1 / np.sqrt(m_plus),
            "hyper_zagreb": m_plus ** 2,
            "geometric_arithmetic": 2 * np.sqrt(m_mul) / m_plus,
            "irregularity_measure": abs(m_minus),
            "sigma": m_minus ** 2,
            "somber": np.sqrt(m_square_plus),
            "forgotten": m_plus ** 2 - 2 * m_mul,
            "symmetric_division_degree": (m_plus ** 2 - 2 * m_mul) / m_mul,
            "augmented_zagreb": (m_mul / (m_plus - 2)) ** 3,
            "bi_zagreb": m_plus + m_mul,
            "tri_zagreb": m_square_plus + m_mul,
            "geometric_harmonic": np.sqrt(m_mul) * m_plus / 2,
            "geometric_bi_zagreb": np.sqrt(m_mul) / (m_plus + m_mul),
            "geometric_tri_zagreb": np.sqrt(m_mul) / (m_square_plus + m_mul),
            "harmonic_geometric": 2 / (np.sqrt(m_mul) * m_plus),
            "harmonic_bi_zagreb": 2 / (m_plus * (m_plus + m_mul)),
            "harmonic_tri_zagreb": 2 / (m_plus * (m_square_plus + m_mul)),
            "bi_zagreb_geometric": (m_plus + m_mul) / np.sqrt(m_mul),
            "bi_zagreb_harmonic": (m_plus + m_mul) * m_plus / 2,
            "tri_zagreb_geometric": (m_square_plus + m_mul) / np.sqrt(m_mul),
            "tri_zagreb_harmonic": m_plus * (m_square_plus + m_mul) / 2
        }

        return matrices

    def compute_degree_indices(self):
        degree_indices = {key: float(np.sum(value))
                          for key, value in self.matrices.items()}

        return degree_indices

    def compute_entropy_indices(self):
        # used to be key + str("entropy")
        entropy_indices = {(key): self.entropy_sum(matrix,
                                                   self.degree_indices[key]) for key, matrix in self.matrices.items()}

        return entropy_indices

    def get_values(self):
        return {**self.degree_indices, **self.entropy_indices}

    def rearrange_deg_edge_list(self, degree_edge_list):
        return np.unique(np.sort(degree_edge_list, axis=1), axis=0, return_counts=True)

    def get_weight_edge_list(self):
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
        
        return weight_edge_list


    def get_degree_edge_list(self):
        return np.array(
            [[self.degree[i], self.degree[j]] for (i, j) in self.edge_list])
        
    def get_deg_edge_partitions(self):
        degree_edge_list = self.get_degree_edge_list()
        return self.rearrange_deg_edge_list(degree_edge_list)
    
    def get_deg_sum_edge_partitions(self):
        weight_edge_list = self.get_weight_edge_list()
        return self.rearrange_deg_edge_list(weight_edge_list)
