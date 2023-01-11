const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const products = ref([]);

    onMounted(() => {
      checkLogin()
    })

    // 驗證是否登入
    function checkLogin() {
      // 取得 token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/,"$1");
      // headers 帶上 token
      axios.defaults.headers.common['Authorization'] = token;

      const url = 'https://vue3-course-api.hexschool.io';
      axios.post(`${url}/v2/api/user/check`)
        .then((res) => {
          // 驗證通過就取得產品
          getProduct()
        })
        .catch((err) => {
          // 驗證失敗跳轉回登入頁
          alert(err.data.message);
          location.href = './login.html';
        })
    }

    // 取得產品列表
    function getProduct() {
      const url = 'https://vue3-course-api.hexschool.io';
      const api_path = 'jyue-web'

      axios.get(`${url}/v2/api/${api_path}/admin/products/all`)
        .then((res) => {
          products.value = Object.values(res.data.products);
          temp.value = products[0];
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 打開 modal
    function openModal(el) {
      const myModal = new bootstrap.Modal(document.getElementById(el), {});
      myModal.show();
    }

    return {
      getProduct,
      checkLogin,
      products,
      openModal
    }
  }
}).mount('#app')