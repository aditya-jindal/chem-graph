import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

def read_pdb_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    conectList=[list(map(int,line[6:].split())) for line in lines if line[:6]=="CONECT"]
    return conectList

def read_txt_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    conectList = [list(map(int, line.split())) for line in lines]
    list_with_index = []
    for i in range(len(conectList)):
        temp_list = [i + 1] + conectList[i]
        list_with_index.append(temp_list)
    return list_with_index

def conectToStr(conectList):
    newList= [' '.join(map(str,list)) for list in conectList]
    return newList



file_path = "C:\\Users\\Aditya Jindal\\Documents\\researchClementJ\\server\\data\\GIS454.pdb"
conectList=conectToStr(read_pdb_file(file_path))

G = nx.parse_adjlist(conectList, nodetype=int)

# number of edges and vertices
num_edges = G.number_of_edges()
num_vertices = G.number_of_nodes()

# shortest distance matrix
dist_matrix = nx.floyd_warshall_numpy(G, nodelist=sorted(G.nodes))

# degree of each node
degree = dict(G.degree)
sorted_dict = dict(sorted(degree.items()))

# generate edge list for column A
edge_list = list(G.edges)
# edge_list = np.array(list(G.edges))
degree_edge_list = np.array([[degree[i], degree[j]] for (i, j) in edge_list])

# generate mplus,mminus,mmul
m_plus = degree_edge_list[:, 0] + degree_edge_list[:, 1]
m_minus = degree_edge_list[:, 0] - degree_edge_list[:, 1]
m_mul = degree_edge_list[:, 0] * degree_edge_list[:, 1]
m_square_plus = degree_edge_list[:, 0] ** 2 + degree_edge_list[:, 1] ** 2



def all_operations(m_plus, m_minus, m_mul, m_square_plus):
    matrices = {
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

    all_values = {key: np.sum(value) for key, value in matrices.items()}
    print("colA:", all_values)
    def entropy_sum(matrix, total_value):
        # if 0 in matrix:
        #     return "indeterminate"
        matrix = np.where(matrix==0, 1, matrix)
        if total_value==0:
            return "indeterminate"
        return -1 * np.sum((matrix / total_value) * np.log(matrix / total_value))

    entropy_matrices = {(key+str("_entropy")): entropy_sum(matrix, all_values[key]) for key, matrix in matrices.items()}
    print("colB:", entropy_matrices)


print("-------colA&B-------")
all_operations(m_plus, m_minus, m_mul, m_square_plus)
print("-------colA&B-------")

# column b
adjacency_list = nx.to_dict_of_lists(G)
weighted_G_dict = {i: sum([G.degree(node) for node in neighbours]) for i, neighbours in adjacency_list.items()}
weighted_G = nx.Graph()
for node in G.nodes():
    weighted_G.add_node(node, weight=weighted_G_dict[node])
for edge in G.edges():
    weighted_G.add_edges_from([edge])
# generate edge list for column B
edge_list = list(G.edges)
weight_edge_list = np.array([[weighted_G.nodes[i]['weight'], weighted_G.nodes[j]['weight']] for (i, j) in edge_list])

# generate mplus,mminus,mmul
m_plus_weighted = weight_edge_list[:, 0] + weight_edge_list[:, 1]
m_minus_weighted = weight_edge_list[:, 0] - weight_edge_list[:, 1]
m_mul_weighted = weight_edge_list[:, 0] * weight_edge_list[:, 1]
m_square_plus_weighted = weight_edge_list[:, 0] ** 2 + weight_edge_list[:, 1] ** 2

# print("--------------")
# all_operations(m_plus_weighted, m_minus_weighted, m_mul_weighted, m_square_plus_weighted)
# print("--------------")

# edge distance matrix testing
# vertex_edge_distance=np.array([[degree[i],degree[j]] for (i,j) in edge_list])

# get vertex to edge distance matrix
vertex_edge_distance=[]
for node in G.nodes:
    # print("node:",node)
    # print(type(dist_matrix))
    node_edge_distance = [min([dist_matrix[node-1][u-1], dist_matrix[node-1][v-1]]) for u, v in G.edges]
    vertex_edge_distance.append(node_edge_distance)
vertex_edge_distance=np.array(vertex_edge_distance)
vertex_edge_wiener=np.sum(vertex_edge_distance)/2

# get edge to edge distance matrix
edge_edge_distance=[]
for u,v in G.edges:
    one_edge_edge_distance=[min([dist_matrix[u-1][x-1], dist_matrix[u-1][y-1], dist_matrix[v-1][x-1], dist_matrix[v-1][y-1]]) for x,y in G.edges]
    edge_edge_distance.append(one_edge_edge_distance)
edge_edge_distance=np.array(edge_edge_distance)
edge_edge_wiener=np.sum(edge_edge_distance)/2

# print("vertex_edge_wiener:",vertex_edge_wiener)
# print("edge_edge_weiner:",edge_edge_wiener)

# szeged index
nu_nv = []
for u,v in G.edges:
    count_u = 0
    count_v = 0
    for node in G.nodes:
        if(dist_matrix[u-1][node-1]>dist_matrix[v-1][node-1]):
            count_v += 1
        elif(dist_matrix[u-1][node-1]<dist_matrix[v-1][node-1]):
            count_u += 1
    nu_nv.append([count_u,count_v])
nu_nv = np.array(nu_nv)
szeged_matrix = nu_nv[:,0]*nu_nv[:,1]
szeged_index = np.sum(szeged_matrix)
# print("szeged_index:",szeged_index)


# edge szeged index
mu_mv=[]
for u,v in G.edges:
    count_u=0
    count_v=0
    for x,y in G.edges:
        if(dist_matrix[u-1][x-1]>dist_matrix[v-1][x-1] and dist_matrix[u-1][y-1]>dist_matrix[v-1][y-1]):
            count_v+=1
        elif(dist_matrix[u-1][x-1]<dist_matrix[v-1][x-1] and dist_matrix[u-1][y-1]<dist_matrix[v-1][y-1]):
            count_u+=1
    mu_mv.append([count_u,count_v])
mu_mv=np.array(mu_mv)
edge_szeged_matrix=mu_mv[:,0]*mu_mv[:,1]
edge_szeged_index=np.sum(edge_szeged_matrix)
# print("edge_szeged_index:",edge_szeged_index)

PI_matrix=nu_nv[:,0]+nu_nv[:,1]
PI=np.sum(PI_matrix)
edge_PI_matrix=mu_mv[:,0]+mu_mv[:,1]
edge_PI=np.sum(edge_PI_matrix)
# print("PI:",PI)
# print("edge_PI:",edge_PI)
mostar_matrix=np.abs(nu_nv[:,0]-nu_nv[:,1])
mostar=np.sum(mostar_matrix)
edge_mostar_matrix=np.abs(mu_mv[:,0]-mu_mv[:,1])
edge_mostar=np.sum(edge_mostar_matrix)
# print("mostar:",mostar)
# print("edge_mostar:",edge_mostar)
# Store all matrices in a dictionary
matrices2 = {
    # "vertex_edge_wiener": vertex_edge_distance,
    # "edge_wiener": edge_edge_distance,
    "szeged": szeged_matrix,
    "edge_szeged": edge_szeged_matrix,
    "PI": PI_matrix,
    "edge_PI": edge_PI_matrix,
    "mostar": mostar_matrix,
    "edge_mostar": edge_mostar_matrix,
}



matrices2_plus={(matrix+str("_plus")):(m_plus*value).astype("int64") for matrix,value in matrices2.items()}
# Sum over all values in matrices2_plus
indices_plus = {key: np.sum(value) for key, value in matrices2_plus.items()}
print("indices_plus:",indices_plus)


matrices2_mul={(matrix+str("_mul")):(m_mul*value).astype("int64") for matrix,value in matrices2.items()}
indices_mul = {key: np.sum(value) for key, value in matrices2_mul.items()}
print("indices_mul:",indices_mul)


# # testing area start
# print("testing area start")
# print("szeged_matrix:",szeged_matrix)
# print("szeged_plus_matrix:",matrices2_plus["szeged_plus"])
# # print("modified_szeged_plus_matrix:",np.where(matrices2_plus["szeged_plus"]==0, 1, matrices2_plus["szeged_plus"]))
# print("sum of normal szeged_plus_matrix:",np.sum(matrices2_plus["szeged_plus"].astype('int64')))
# # print("sum of modified:",np.sum(np.where(matrices2_plus["szeged_plus"]==0, 1, matrices2_plus["szeged_plus"])))
# print("testing area end")
# # testing area end







edge_vertex_szeged=(nu_nv[:,0]*mu_mv[:,1]+nu_nv[:,1]*mu_mv[:,0])/2
total_szeged=matrices2["szeged"]+matrices2["edge_szeged"]+2*edge_vertex_szeged
total_mostar=np.abs((nu_nv[:,0]+mu_mv[:,0])-(nu_nv[:,1]+mu_mv[:,1]))
print("total_szeged:",np.sum(total_szeged))
print("total_mostar:",np.sum(total_mostar))
print("edge vertex szeged:",np.sum(edge_vertex_szeged))

# distance based entropies:
def dist_entropies():
    def entropy_sum(matrix, total_value):
        # if 0 in matrix:
        #     return "indeterminate"
        matrix = np.where(matrix==0, 1, matrix)
        return -1 * np.sum((matrix / total_value) * np.log(matrix / total_value))    
    szeged_entropy=entropy_sum(szeged_matrix, szeged_index)
    edge_szeged_entropy=entropy_sum(edge_szeged_matrix, edge_szeged_index)
    PI_entropy=entropy_sum(PI_matrix, PI)
    mostar_entropy=entropy_sum(mostar_matrix, mostar)
    edge_PI_entropy=entropy_sum(edge_PI_matrix, edge_PI)
    edge_mostar_entropy=entropy_sum(edge_mostar_matrix, edge_mostar)
    total_mostar_entropy=entropy_sum(total_mostar, np.sum(total_mostar))
    edge_vertex_szeged_entropy=entropy_sum(edge_vertex_szeged, np.sum(edge_vertex_szeged))
    print("szeged_entropy:",szeged_entropy)
    print("edge_szeged_entropy:",edge_szeged_entropy)
    print("edge_vertex_szeged_entropy:",edge_vertex_szeged_entropy)
    print("PI_entropy:",PI_entropy)
    print("edge_PI_entropy:",edge_PI_entropy)
    print("mostar_entropy:",mostar_entropy)
    print("edge_mostar_entropy:",edge_mostar_entropy)
    print("total_mostar_entropy:",total_mostar_entropy)
def print_weighted_dist_indices():
    print("szeged_matrix:", szeged_index)
    print("edge_szeged_matrix:", edge_szeged_index)
    print("PI_matrix:", PI)
    print("edge_PI_matrix:", edge_PI)
    print("mostar_matrix:", mostar)
    print("edge_mostar_matrix:", edge_mostar)
    print("total_mostar:",np.sum(total_mostar))
    print("edge vertex szeged:",np.sum(edge_vertex_szeged))
    print("total_szeged:",np.sum(total_szeged))    
def columnf():
    def entropy_sum(matrix, total_value):
        # if 0 in matrix:
        #     return "indeterminate"
        matrix = np.where(matrix==0, 1, matrix)
        if total_value==0:
            print("inderminate matrix:",matrix)
            print("total_value:",total_value)
            return "indeterminate"
        return -1 * np.sum((matrix / total_value) * np.log(matrix / total_value))    

    entropy_matrices2_sum = {(key+str("_entropy")): entropy_sum(matrix, np.sum(matrix)) for key, matrix in matrices2_plus.items()}
    print(entropy_matrices2_sum)
    entropy_matrices2_mul = {(key+str("_entropy")): entropy_sum(matrix, np.sum(matrix)) for key, matrix in matrices2_mul.items()}
    print(entropy_matrices2_mul)
print("--------------")
columnf()
print("--------------")
# dist_entropies()
# print_weighted_dist_indices()




# plot the graph
nx.draw_kamada_kawai(G, with_labels=True)
plt.show()
# pos = nx.spring_layout(weighted_G, k=0.3)  # k adjusts the distance between nodes
# nx.draw(weighted_G, pos,node_size=1000, node_color='skyblue')

# Draw node weights
# node_weights = nx.get_node_attributes(weighted_G, 'weight')
# nx.draw_networkx_labels(weighted_G, pos, labels=node_weights)

# plt.show()
