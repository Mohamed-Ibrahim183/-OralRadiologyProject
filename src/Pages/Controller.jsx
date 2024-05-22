import React from "react";
import axios from "axios";

// const axiosMethods = {
//   get: axios.get(),
// }

class axiosMethods {
  get(url, params = {}) {
    return axios
      .get(url, { params })
      .then((res) => ({ msg: res.data, error: "" }))
      .catch((error) => ({ msg: "", error: error.message }));
  }

  post(url, data) {
    if (!(data instanceof FormData)) {
      let fData = new FormData();
      Object.keys(data).forEach((ele) => {
        fData.append(ele, data[ele]);
      });
      data = fData;
    }

    return axios
      .post(url, data)
      .then((res) => ({ msg: res.data, error: "" }))
      .catch((error) => ({ msg: "", error: error.message }));
  }

  put(url, data) {
    return axios
      .put(url, data)
      .then((res) => ({ msg: res.data, error: "" }))
      .catch((error) => ({ msg: "", error: error.message }));
  }

  delete(url) {
    return axios
      .delete(url)
      .then((res) => ({ msg: res.data, error: "" }))
      .catch((error) => ({ msg: "", error: error.message }));
  }
}
const Controller = () => {
  return <div>Controller</div>;
};

// export default Controller;
export { Controller, axiosMethods };
