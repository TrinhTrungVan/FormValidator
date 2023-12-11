const Validator = (options) => {
 //An object containing functions, each function returns errorMessage if there is an error
 // otherwise returns undefined
 const validateFn = {
  required: (fieldName) =>
   formValue[fieldName] ? undefined : `The ${fieldName} is required.`,
  min: (min) => (fieldName) =>
   formValue[fieldName].length >= Number(min)
    ? undefined
    : `The ${fieldName} must have at least ${min} characters.`,
  max: (max) => (fieldName) =>
   formValue[fieldName].length < Number(max)
    ? undefined
    : `The ${fieldName} cannot exceed ${max} characters.`,
  isEmail: (fieldName) => {
   const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
   return regex.test(formValue[fieldName])
    ? undefined
    : `This field must be email.`
  },
  notContainSpecialChar: (fieldName) => {
   // Regex check string contains at least 1 special character
   const regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
   return !regex.test(formValue[fieldName])
    ? undefined
    : `The ${fieldName} cannot contain special characters.`
  },
  containAtLeastOneUpper: (fieldName) => {
   // Regex check string contains at least 1 uppercase character
   const regex = /(?=.*[A-Z])/
   return regex.test(formValue[fieldName])
    ? undefined
    : `The ${fieldName} must have at least 1 uppercase characters.`
  },
  containAtLeastOneLower: (fieldName) => {
   // Regex check string contains at least 1 lowercase character
   const regex = /(?=.*[a-z])/
   return regex.test(formValue[fieldName])
    ? undefined
    : `The ${fieldName} must have at least 1 lowercase characters.`
  },
  matchWith: (fieldMatch) => (fieldName) => {
   return formValue[fieldName] === formValue[fieldMatch]
    ? undefined
    : `The ${fieldName} not match.`
  },
 }

 const handleValidator = (e) => {
  const { name: fieldName, value } = e.target
  formValue[fieldName] = value

  const formGroup = e.target.closest('.form-group')
  const formMessage = formGroup.querySelector('.form-message')
  if (!formGroup || !formMessage) return

  const fieldRules = formRules[fieldName]
  let errorMessage = null

  fieldRules.some((rule) => {
   errorMessage = rule(fieldName)
   if (errorMessage) return errorMessage
  })

  if (errorMessage) {
   formGroup.classList.add('invalid')
   formMessage.innerHTML = errorMessage
   formStatus[fieldName] = false
  } else {
   formGroup.classList.remove('invalid')
   formMessage.innerHTML = null
   formStatus[fieldName] = true
  }

  // Change formStatus when field change
  formIsInvalid = Object.keys(formStatus).some(
   (key) => formStatus[key] === false
  )
  submitBtn.disabled = formIsInvalid
 }

 const { formId, formSchema } = options
 const form = document.getElementById(formId)
 if (!form) return
 const fields = form.querySelectorAll('input')
 const submitBtn = form.querySelector('button')

 let formIsInvalid = true
 const formValue = {}
 const formRules = {}
 const formStatus = {}

 Object.keys(formSchema).forEach((fieldName) => {
  const fieldRules = formSchema[fieldName].map((rule) => {
   if (rule.includes(':')) {
    const [ruleName, ruleValue] = rule.split(':')
    return validateFn[ruleName](ruleValue)
   }
   return validateFn[rule]
  })

  formRules[fieldName] = fieldRules
  formStatus[fieldName] = false
 })

 fields.forEach((field) => {
  field.onblur = handleValidator
  field.oninput = handleValidator
 })

 const handleSubmit = (e) => {
  e.preventDefault()
  if (formIsInvalid) return
  alert('Register Success!')
 }

 form.onsubmit = handleSubmit
}
