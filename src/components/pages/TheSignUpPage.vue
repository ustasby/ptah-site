<template>
  <div>
    <form action="" @submit.prevent="submit" class="b-auth">
      <div class="b-auth-left">
      <span class="b-auth-logo-ptah">
        <BasePtahLogo />
      </span>

        <span class="b-auth-center">
        <span class="b-auth-center__text">
          Sell your game directly to consumers with
        </span>
        <span class="b-auth-center__logo-ptah">
          <BasePtahLogo />
        </span>
      </span>
      </div>
      <div class="b-auth-right">
        <span class="b-auth-right__logo-ptah">
          <BasePtahLogo />
        </span>
        <span class="b-auth-right__get-start _m-hide">
          <span>
            Already have an account?
          </span>
          <span class="b-get-link" @click="goToLoginPage">
            Sign in
          </span>
        </span>
        <span class="b-get-link-m" @click="goToLoginPage">
          Sign in
        </span>
        <div class="b-auth-right-contain">
          <!-- form -->
          <div class="b-auth-form">
            <div class="b-auth-form__chapter">
              Sign Up to Ptah
            </div>

            <!--
            <div class="b-auth-form__description">
              Use social media or enter your data below to sign in
            </div>
            <div class="b-auth-form__third-party-auth">

            </div>
            <div class="b-auth-form__buttons">
              <SocialButtons />
            </div>
            <div class="b-auth-form__delimiter">
              or
            </div>
            -->
            <div class="b-auth-form__delimiter" />

            <div class="b-form">
              <div class="b-form-row">
                <base-text-field-auth
                  label="How can we name you?"
                  placeholder="Your name"
                  :hasError="$v.name.$error"
                  :errorText="errorTexts.name"
                  v-model.trim="$v.name.$model"
                />
              </div><!--/.b-form-row -->
              <div class="b-form-row">
                <base-text-field-auth
                  label="Your email"
                  placeholder="Provide your email to sign up"
                  type="text"
                  :hasError="errors.email || $v.email.$error"
                  :errorText="errorTexts.email"
                  v-model.trim="$v.email.$model"
                />
              </div><!--/.b-form-row -->
              <div class="b-form-row">
                <base-text-field-auth
                  label="Password"
                  placeholder="8+ symbols long with letters & numbers"
                  :hasError="errors.password || $v.password.$error"
                  :errorText="errorTexts.password"
                  type="password"
                  v-model="$v.password.$model"
                />
              </div><!--/.b-form-row -->
              <div class="b-form-row">
                <div class="b-auth-form__description-after-form">
                  <span>By creating an account, you argee to the</span>
                  <a href="/terms" target="_blank">
                    Terms of Service</a>
                  & <a href="/policy" target="_blank">
                  Privacy Policy
                </a>.
                </div>
              </div><!--/.b-form-row -->
              <div class="b-form-row">
                <div class="b-auth-form__description-after-form">
                  <button
                    class="b-button-main"
                    type="submit"
                    :disabled="!disabledBtn || loading"
                  >
                    Sign Up
                  </button>
                </div>
              </div><!--/.b-form-row -->
            </div>
          </div>
          <!--/ end form -->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, minLength, email } from 'vuelidate/lib/validators'
import { mobileDetect } from '../../utils'

export default {
  name: 'TheSignUpPage',

  data () {
    return {
      loading: false,
      email: '',
      name: '',
      password: '',
      repeatPassword: '',
      errors: {
        email: false,
        name: false,
        password: false
      },
      errorTexts: {
        email: 'Enter a valid email',
        name: 'Name is required',
        password: 'The password must be at least 8 characters long and include letters and numbers only'
      },
      errorsArr: {
        'signup_name_is_required': {
          name: 'name',
          text: 'Name is required'
        },
        'signup_invalid_email': {
          name: 'email',
          text: 'Enter a valid email'
        },
        'signup_email_cannot_be_used': {
          name: 'email',
          text: 'Email cannot be used'
        },
        'signup_weak_password': {
          name: 'password',
          text: 'The password must be at least 8 characters long and include letters and numbers only'
        }
      }
    }
  },

  computed: {
    disabledBtn () {
      return this.email !== '' && this.name !== '' &&  this.password !== ''
    },

    isMobile () {
      return mobileDetect()
    }
  },

  validations: {
    email: {
      required,
      email
    },
    name: {
      required
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },

  methods: {
    ...mapActions('User', ['signUp']),

    submit () {
      this.loading = true
      this.$v.$touch()
      this.resetErrors()
      window.fbq('track', 'Lead');

      if (!this.$v.$invalid) {
        this.signUp({
          email: this.email,
          name: this.name,
          password: this.password
        })
          .then(() => {
            try {
              window.gtag('event', 'registration_complete')
            } catch (e) {
              console.log('registration_complete')
            }

            // redirect to onboarding
            if (!this.isMobile) {
              if (process.env.NODE_ENV === 'production') {
                setTimeout(() => {
                  window.location.href = process.env.VUE_APP_EDITOR_DOMAIN
                }, 100)
              } else {
                this.$router.push('/')
              }
            } else {
              this.$router.push('/after-sign-up')
            }
          })
          .catch(e => {
            const mess = e.response.data.error.message
            const name = this.errorsArr[mess].name
            const text = this.errorsArr[mess].text

            this.errorTexts[name] = text
            this.errors[name] = true
          })
          .finally(() => this.loading = false)
      }
    },

    resetErrors () {
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = false
      })

      Object.keys(this.errorTexts).forEach(key => {
        this.errorTexts[key] = ''
      })
    },

    goToLoginPage () {
      this.$router.push({ path: `/login` })
    }
  }
}
</script>

<style lang="sass">
@import '../../assets/sass/auth.sass'
</style>
