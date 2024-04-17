from graph import Graph
import networkx as nx
import numpy as np


class BasicValues(Graph):
    def __init__(self, file, testing=False):
        super().__init__(file, testing)
        self.num_edges = self.graph.number_of_edges()
        self.num_vertices = self.graph.number_of_nodes()
        self.degree = dict(self.graph.degree)
        self.edge_list = list(self.graph.edges)
        self.matrices = None
        self.columnA_values = None
        self.entropy_values = None

    def compute_matrices(self, m_plus, m_minus, m_mul, m_square_plus):
        self.matrices = {
            "first_zagreb": m_plus,
            "second_zagreb": m_mul,
            "randic": 1 / np.sqrt(m_mul),
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

        # return matrices

    def compute_columnA(self):

        self.columnA_values = {key: float(np.sum(value))
                               for key, value in self.matrices.items()}

        # return columnA_values

    def entropy_sum(self, matrix, total_value):
        # if 0 in matrix:
        #     return "indeterminate"
        matrix = np.where(matrix == 0, 1, matrix)
        if total_value == 0:
            return "indeterminate"

        return -1 * float(np.sum((matrix / total_value) * np.log(matrix / total_value)))

    def compute_entropy(self):
        self.entropy_values = {(key+str("_entropy")): self.entropy_sum(matrix,
                                                                       self.columnA_values[key]) for key, matrix in self.matrices.items()}
        # print("colB:", entropy_matrices)

        # return entropy_values

    def get_values(self):
        # return self.columnA_values
        return {**self.columnA_values, **self.entropy_values}

    def capitalize_dictionary(self, dictionary):
        return {key.replace('_', ' ').title(): value for key, value in dictionary.items()}
