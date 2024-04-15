import SessionForm from "@/components/SessionForm"

function CreateSessionPage() {
    return (
        <div className="flex h-[calc(100vh-75px)] flex-col items-center justify-center space-y-4">
            <SessionForm mode="add" />
        </div>
    )
}

export default CreateSessionPage