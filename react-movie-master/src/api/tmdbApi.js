import axiosClient from "./axiosClient";

export const category = {
  movie: "movie",
};

export const movieType = {
  upcoming: "upcoming",
  popular: "popular",
  top_rated: "top_rated",
};

const tmdbApi = {
  getMoviesList: (type, params) => {
    const url = "movie/" + movieType[type];
    return axiosClient.get(url, params);
  },
  getVideos: (cate, id) => {
    const url = "movie/" + id + "/videos";
    return axiosClient.get(url, { params: {} });
  },
  search: (cate, params) => {
    const url = "search/movie";
    return axiosClient.get(url, params);
  },
detail: (cate, id, params) => {
    if (!id) {
        console.error("Movie ID is missing!");
        return Promise.reject(new Error("Movie ID is missing"));
    }

    const url = "movie/" + id;
    return axiosClient.get(url, params);
},
  credits: (cate, id) => {
    const url = "movie/" + id + "/credits";
    return axiosClient.get(url, { params: {} });
  },
  similar: (cate, id) => {
    const url = "movie/" + id + "/similar";
    return axiosClient.get(url, { params: {} });
  },
};

export default tmdbApi;