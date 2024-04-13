from column_e import ColumnE
import numpy as np


class ColumnF(ColumnE):
    def __init__(self, file, testing=False):
        super().__init__(file, testing=testing)
        self.distance_entropies = {key: self.entropy_sum(matrix, self.distance_indices[key])
                                   for key, matrix in self.distance_matrices.items()}

    def get_distance_entropies(self):
        return self.distance_entropies
