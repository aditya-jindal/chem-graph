from column_ab import ColumnAB
import networkx as nx
import numpy as np
from igraph import Graph as igraph
import time

SAVE_MEM = np.float32


class ColumnE(ColumnAB):
    def __init__(self, file, testing=False):
        super().__init__(file, testing=testing)
        self.dist_matrix = self.floyd_warshall_igraph()
        self.nu_nv = self.compute_nu_nv()
        self.mu_mv = self.compute_mu_mv()
        self.distance_matrices = self.compute_distance_matrices()
        self.distance_indices = self.compute_distance_indices()

    def nx_to_igraph(self, nx_graph):
        edges = [(e[0], e[1]) for e in nx_graph.edges()]

        return igraph(edges=edges, directed=False)

    def calculate_shortest_path_matrix(self, igraph_graph):
        shortest_paths = np.array(
            igraph_graph.shortest_paths(), dtype=SAVE_MEM)

        return shortest_paths

    def floyd_warshall_igraph(self):
        ig = self.nx_to_igraph(self.graph)
        shortest_paths_matrix = self.calculate_shortest_path_matrix(ig)

        return shortest_paths_matrix[1:, 1:]

    def compute_nu_nv(self):
        nu_nv = []
        for u, v in self.graph.edges:
            dist_u = self.dist_matrix[u-1]
            dist_v = self.dist_matrix[v-1]
            count_u = np.sum(dist_u < dist_v)
            count_v = np.sum(dist_u > dist_v)
            nu_nv.append([count_u, count_v])
        nu_nv = np.array(nu_nv, dtype=SAVE_MEM)

        return nu_nv

    def compute_mu_mv(self):
        mu_mv = []
        intermediate_edge_list = np.array(self.graph.edges)
        edge_list = intermediate_edge_list[:, 0] - 1
        edge_list_other = intermediate_edge_list[:, 1] - 1
        for u, v in self.graph.edges:
            dist_u = self.dist_matrix[u-1]
            dist_v = self.dist_matrix[v-1]
            dist_u_edges = dist_u[edge_list]
            dist_v_edges = dist_v[edge_list]
            dist_u_edges_other = dist_u[edge_list_other]
            dist_v_edges_other = dist_v[edge_list_other]
            count_u = np.sum((dist_u_edges < dist_v_edges) & (
                dist_u_edges_other < dist_v_edges_other))
            count_v = np.sum((dist_u_edges > dist_v_edges) & (
                dist_u_edges_other > dist_v_edges_other))
            mu_mv.append([count_u, count_v])
        mu_mv = np.array(mu_mv, dtype=SAVE_MEM)

        return mu_mv

    def compute_distance_matrices(self):
        matrices = {
            "szeged": self.nu_nv[:, 0]*self.nu_nv[:, 1],
            "edge_szeged": self.mu_mv[:, 0]*self.mu_mv[:, 1],
            "PI": self.nu_nv[:, 0]+self.nu_nv[:, 1],
            "edge_PI": self.mu_mv[:, 0]+self.mu_mv[:, 1],
            "mostar": np.abs(self.nu_nv[:, 0]-self.nu_nv[:, 1]),
            "edge_mostar": np.abs(self.mu_mv[:, 0]-self.mu_mv[:, 1]),
        }

        matrices_plus = {(matrix+str("_plus")): (self.m_plus*value).astype("int64")
                         for matrix, value in matrices.items()}

        matrices_mul = {(matrix+str("_mul")): (self.m_mul*value).astype("int64")
                        for matrix, value in matrices.items()}

        edge_vertex_szeged_matrix = (
            self.nu_nv[:, 0]*self.mu_mv[:, 1]+self.nu_nv[:, 1]*self.mu_mv[:, 0])/2

        total_szeged_matrix = matrices["szeged"] + \
            matrices["edge_szeged"]+2*edge_vertex_szeged_matrix

        total_mostar_matrix = np.abs(
            (self.nu_nv[:, 0]+self.mu_mv[:, 0])-(self.nu_nv[:, 1]+self.mu_mv[:, 1]))

        matrices = {**matrices, **matrices_plus, **matrices_mul, "edge_vertex_szeged": edge_vertex_szeged_matrix,
                    "total_szeged": total_szeged_matrix, "total_mostar": total_mostar_matrix}

        return matrices

    def compute_distance_indices(self):
        indices = {}
        for key, value in self.distance_matrices.items():
            indices[key] = float(np.sum(value))

        node_edge_distances = np.minimum(self.dist_matrix[:, np.array([e[0] - 1 for e in self.graph.edges])],
                                         self.dist_matrix[:, np.array([e[1] - 1 for e in self.graph.edges])])
        vertex_edge_wiener_index = np.sum(node_edge_distances) / 2

        edge_indices = np.array([e[0] - 1 for e in self.graph.edges])
        edge_indices_other = np.array([e[1] - 1 for e in self.graph.edges])
        edge_edge_distances = []
        for u, v in self.graph.edges:
            u_dist = self.dist_matrix[u - 1]
            v_dist = self.dist_matrix[v - 1]
            one_edge_edge_distance = np.minimum(np.minimum(u_dist[edge_indices], u_dist[edge_indices_other]),
                                                np.minimum(v_dist[edge_indices], v_dist[edge_indices_other]))
            edge_edge_distances.append(one_edge_edge_distance)
        edge_edge_distances = np.array(edge_edge_distances, dtype=SAVE_MEM)
        edge_wiener_index = np.sum(edge_edge_distances) / 2

        indices["vertex_edge_wiener"] = float(vertex_edge_wiener_index)
        indices["edge_wiener"] = float(edge_wiener_index)

        return indices

    def get_distance_indices(self):
        return self.capitalize_dictionary(self.distance_indices)
