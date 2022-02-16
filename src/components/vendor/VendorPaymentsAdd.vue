<template>


<n-button @click="doShowOuter">

    <n-icon>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z" fill="currentColor"></path></svg>
    </n-icon>
    Add Payment
</n-button>
  <n-drawer v-model:show="showOuter" :width="500">
    <n-drawer-content title="Add Payment">
    <n-form
    :model="formValue"
    :label-width="90"
    :rules="rules"
    size="medium"
    ref="formRef"
    >   
    
      <n-form-item label="Name" path="name" class="pt-0">
        <n-input type="text" min-length="2" placeholder="Enter Name" clearable v-model:value.trim="formValue.name" />
        </n-form-item>
       
        <n-form-item label="Description" path="description">
        <masked-input mask="(###) ###-####"  placeholder="Enter Description" clearable v-model:value="formValue.description" />
        </n-form-item>
        <n-form-item label="Type" path="type">
        <masked-input mask="(###) ###-####"  placeholder="Enter Type" clearable v-model:value="formValue.type" />
        </n-form-item>
        <n-form-item  label="Amount" path="amount" >
          <n-input type="text" min-length="2" placeholder="Enter Amount" clearable v-model:value.trim="formValue.amount" /> 
        </n-form-item>

    </n-form>
      <template #footer>
       <n-button size="large" @click="addExpense()" >Add</n-button>
      </template>
    </n-drawer-content>
    
  </n-drawer>
  
</template>


<script>
import { defineComponent, ref } from 'vue'
import vendors from "@/api/vendors";

import { useMessage } from 'naive-ui'
import MaskedInput from "@/components/common/MaskedInput.vue";

export default defineComponent({
  setup () {
    const showOuterRef = ref(false)

    const formRef = ref(null)
    const message = useMessage()    

    let feedback = ref('')
    let status = ref('')

    function validateEmail(v){
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) {
          console.log('success')
      } else {
          console.log('nope')
          feedback = 'Please enter a valid email address.'
          status = 'error'

      }
    } 
    function addExpense(){
      

      formRef.value.validate((errors) => {
    console.log(route.params?.id)
      validateEmail(this.formValue.email)
          if (!errors) {

                const data = {
                vendor_id: route.params?.id,
                name: this.formValue.name,
                description: this.formValue.description,
                type: this.formValue.type,
                amount: this.formValue.amount,

            }

            vendors.addContacts(data).then( res => {                  
                    message.success("Successfully added contact!")
                    showOuterRef.value = false;
                }).finally(res =>{
                    this.formValue.id=0,
                    this.formValue.name= '',
                    this.formValue.description= '',
                    this.formValue.type= '',
                    this.formValue.amount= ''

                    
                    
                }).catch(err => {
                    console.log(err)
                })

          } else {
            console.log(errors)

              }
            })
    }
    
    return {
        formRef,
        formValue: ref({

        }),
        
        rules: {
          name: {
            required: true,
            message: 'Please enter a Name',
            trigger: ['input']
          },
          description: {
            required: false,
            message: 'Please enter a valid Description',
            trigger: ['input']
          },
          type: {
            required: true,
            message: 'Please enter a valid type',
            trigger: ['input']
          },
          amount: {
            required: true,
            message: 'Please select a valid amount',
            trigger: ['input']
          },
          
        
        },
        addExpense,

        showOuter: showOuterRef,

        doShowOuter () {
            showOuterRef.value = true
        },

    }
    
  },
  
  components: {
			MaskedInput
		},
  
})
</script>