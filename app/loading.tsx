import Image from "next/image";

const LoadingPage = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
                    
                    <div className="h-5 w-5 rounded-full bg-primary" />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-medium text-foreground">
                        Loading
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Please wait a moment...
                    </p>
                </div>
            </div>
        </div>
    )
}
 
export default LoadingPage;