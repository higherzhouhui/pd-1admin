// export default {
//     install (Vue, options) {
//       Vue.directive("roleBtn", {
//         inserted: function (el, binding) {
//           let roleArr = binding.value // 获取按钮所需权限
//           let userRole = JSON.parse(localStorage.getItem("info")).role// 获取当前用户权限
//           if (roleArr && roleArr.indexOf(userRole) !== -1) {
//             return false
//           } else {
//             el.parentNode.removeChild(el)
//           }
//         }
//       })
//     }
//   }