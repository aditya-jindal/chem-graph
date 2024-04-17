from four_columns import FourColumns
import numpy as np


class ColumnAB(FourColumns):
    def __init__(self, file, testing=False):
        super().__init__(file, testing=testing)

        self.m_plus, self.m_minus, self.m_mul, self.m_square_plus = self.compute_m_values()
        self.matrices = self.compute_matrices(
            self.m_plus, self.m_minus, self.m_mul, self.m_square_plus)
        self.degree_indices = self.compute_degree_indices()
        self.entropy_indices = self.compute_entropy_indices()

    def compute_m_values(self):
        degree_edge_list = np.array(
            [[self.degree[i], self.degree[j]] for (i, j) in self.edge_list])
        m_plus = degree_edge_list[:, 0] + degree_edge_list[:, 1]
        m_minus = degree_edge_list[:,
                                   0] - degree_edge_list[:, 1]
        m_mul = degree_edge_list[:, 0] * degree_edge_list[:, 1]
        m_square_plus = degree_edge_list[:,
                                         0] ** 2 + degree_edge_list[:, 1] ** 2

        return m_plus, m_minus, m_mul, m_square_plus

    def get_ab_values(self):
        return {"Column A: Degree Indices": self.capitalize_dictionary(self.degree_indices), "Column B: Degree Entropy": self.capitalize_dictionary(self.entropy_indices)}
