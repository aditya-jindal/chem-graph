from four_columns import FourColumns
from column_ab import ColumnAB
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
        weight_edge_list = self.get_weight_edge_list()

        m_plus_weighted = weight_edge_list[:, 0] + weight_edge_list[:, 1]
        m_minus_weighted = weight_edge_list[:, 0] - weight_edge_list[:, 1]
        m_mul_weighted = weight_edge_list[:, 0] * weight_edge_list[:, 1]
        m_square_plus_weighted = weight_edge_list[:,
                                                  0] ** 2 + weight_edge_list[:, 1] ** 2

        return m_plus_weighted, m_minus_weighted, m_mul_weighted, m_square_plus_weighted

    def get_values(self):
        return {"Degree Sum Based Indices": self.capitalize_dictionary(self.degree_indices), "Degree Sum Based Entropies": self.capitalize_dictionary(self.entropy_indices)}
