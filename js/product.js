const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const api_url = ref('https://vue3-course-api.hexschool.io');
    const api_path = ref('jyue-web');
    const products = ref([]);
    const newProduct = ref({
      title: '',
      category: '',
      origin_price: 0,
      price: 0,
      unit: '',
      description: '',
      content: '',
      is_enabled: 1,
      imageUrl: '',
      imagesUrl: []
    });

    onMounted(() => {
      checkLogin();
    })

    // 驗證是否登入
    function checkLogin() {
      // 取得 token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
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
      axios.get(`${api_url.value}/v2/api/${api_path.value}/admin/products/all`)
        .then((res) => {
          
          products.value = Object.values(res.data.products);
          console.log('取得產品', products.value)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 新增產品
    function addProduct() {
      const data = {
        data: newProduct.value
      }
      axios.post(`${api_url.value}/v2/api/${api_path.value}/admin/product`, data)
        .then((res) => {
          // 關閉 modal，但關不起來 ？
          const myModal = new bootstrap.Modal(document.getElementById('productModal'), {});
          myModal.hide();
          getProduct();
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
      api_url,
      api_path,
      newProduct,
      products,
      checkLogin,
      getProduct,
      addProduct,
      openModal
    }
  }
}).mount('#app')