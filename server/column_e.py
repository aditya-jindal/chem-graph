from column_ab import ColumnAB
import networkx as nx
import numpy as np
from igraph import Graph as igraph


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
        shortest_paths = np.array(igraph_graph.shortest_paths())

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
        nu_nv = np.array(nu_nv)

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
        mu_mv = np.array(mu_mv)

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
        indices = {key: float(np.sum(value))
                   for key, value in self.distance_matrices.items()}

        vertex_edge_distance = []
        for node in self.graph.nodes:
            node_edge_distance = [min(
                [self.dist_matrix[node-1][u-1], self.dist_matrix[node-1][v-1]]) for u, v in self.graph.edges]
            vertex_edge_distance.append(node_edge_distance)
        vertex_edge_distance = np.array(vertex_edge_distance)

        vertex_edge_wiener_index = np.sum(vertex_edge_distance)/2

        edge_edge_distance = []
        for u, v in self.graph.edges:
            one_edge_edge_distance = [min([self.dist_matrix[u-1][x-1], self.dist_matrix[u-1][y-1],
                                          self.dist_matrix[v-1][x-1], self.dist_matrix[v-1][y-1]]) for x, y in self.graph.edges]
            edge_edge_distance.append(one_edge_edge_distance)
        edge_edge_distance = np.array(edge_edge_distance)

        edge_edge_wiener_index = np.sum(edge_edge_distance)/2

        indices = {**indices, "vertex_edge_wiener": float(vertex_edge_wiener_index),
                   "edge_edge_wiener": float(edge_edge_wiener_index)}

        return indices

    def get_distance_indices(self):
        return self.capitalize_dictionary(self.distance_indices)
