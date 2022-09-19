<template>
  <div class="login-container">
    <div class="login-bgc">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <div class="logo-img">
            <img src="../../assets/LOGO@2x.png" alt="" />
          </div>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            id="account"
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            id="psw"
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <div class="captcha-container">
          <div class="vPicBox">
            <el-form-item prop="captcha">
              <el-input
                id="captcha"
                :key="passwordType"
                oninput="value=value.replace(/[^0-9]/g,'')"
                v-model="loginForm.captcha"
                type="text"
                placeholder="请输入验证码"
                name="captcha"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
          </div>
          <div class="vPic">
            <img :src="captchaPic" @click="loginVerify()" />
          </div>
        </div>

        <el-button
          id="login_btn"
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </el-form>
      <div class="info" style="bottom: 40px"></div>
      <div class="info"></div>
      <div class="login-right-banner"></div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        username: "",
        password: "",
        captcha: "",
        captchaId: "",
      },
      captchaPic: "",
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    loginVerify() {
      let that = this;
      this.req({
        url: `/base/captcha`,
        data: {},
        method: "POST",
      }).then(
        (res) => {
          console.log("res :", res);
          that.loginForm.captchaId = res.data.captchaId;
          that.captchaPic =res.data.picPath;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    handleLogin() {
      let that = this;
      this.loading = true;

      this.req({
        url: "/base/login",
        data: {
          username: that.loginForm.username,
          // password: md5(that.loginForm.password + "*/-sz"), //对密码进行加盐md5处理
          password:that.loginForm.password,
          captcha:that.loginForm.captcha,
          captchaId:that.loginForm.captchaId
        },
        method: "POST",
      }).then(
        (res) => {
          console.log("res :", res);
          localStorage.setItem("hasLogin", true);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userInfo", JSON.stringify(res.data.user));
          this.$router.push({ path: "/work/worklist" });
        },
        (err) => {
          console.log("err :", err);
          this.passwordError = true;
          this.loading = false;
          this.loginVerify();
        }
      );
    },
  },
  created() {
    this.loginVerify();
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.info {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: gainsboro;
}
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: black;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("../../assets/loginBackground.jpg") no-repeat;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    padding: 60px 35px 40px;
    margin: 0 auto;
    margin-left: 100px;
    margin-top: 30px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 2px 3px 7px rgba(0, 0, 0, 0.2);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: black;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    display: flex;

    .logo-img {
      width: 230px;
      height: 64px;
      margin: 0px auto 40px auto;
      text-align: center;
      img {
        width: 100%;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    user-select: none;
  }
}
.login-right-banner {
  background: url("../../assets/login_left.svg");
  background-size: cover;
  width: 40%;
  height: 60%;
  /* position: absolute; */
  margin-right: 100px;
}
.login-bgc {
  position: absolute;
  top: 3vh;
  left: 2vw;
  width: 96vw;
  height: 94vh;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.captcha-container {
  width: 100%;
  display: flex;
}
.vPicBox {
  width: 60%;
}
.vPic {
  margin-left: 30px;
  width: 33%;
  height: 50px;
  background: #ccc;
  img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
}
</style>
