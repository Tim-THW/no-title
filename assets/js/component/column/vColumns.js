export default {
    template: `
        <div class="vColumns" :style="style">
            <slot></slot>
        </div>
    `,
    props: {
        reverse: {
            default: false,
            type: Boolean
        }  
    },
    setup(props){
        const {ref} = Vue
        
        const reverse = props.reverse

        const style = ref({flexDirection: reverse ? 'column-reverse' : 'column'})

        return {style}
    }
}