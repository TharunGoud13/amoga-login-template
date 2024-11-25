import FormBuilder from "@/components/form-builder/FormBuilder"

const EditForm = (props: any) => {
    const pathName = props.params.id
    console.log("pathname---",pathName)
    return(
        <div>
            <FormBuilder/>
        </div>
    )
}

export default EditForm