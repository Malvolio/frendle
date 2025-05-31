// Just listing all the UI components used in the project so I can get a sense of the design system

import { useEffect } from "react";
import ReactRough, { Rectangle } from 'rough-react-wrapper'


export function UIKit() {
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://unpkg.com/wired-elements?module";
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="container py-10 bg-[#EFE4D2]">

            <h1 >UI Kit</h1>
            <p className="text-lg mb-6">
                This page showcases the UI components used in the Frendle. </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
                <div className="border p-8 border-black">
                    <h2>Buttons</h2>

                    <wired-button>Click Me</wired-button>
                    <wired-button disabled>Disabled</wired-button>
                    <wired-button elevation="3">Elevation</wired-button>
                </div>
                <div className="border p-8 border-black flex flex-col justify-center">
                    <h2>Inputs</h2>

                    <wired-input className="!bg-transparent" part="input" placeholder="TEST field..." />
                    😡 I can't get this background to be transparent...

                    <wired-textarea placeholder="text area..." />

                </div>

                <div className="border p-8 border-black flex flex-col justify-center">
                    <h2>Links</h2>
                    <a href="https://wiredjs.com/" target="_blank" rel="noopener noreferrer">Text link</a>

                </div>

                <div className="border p-8 border-black flex flex-col justify-center">
                    <h2>Containers</h2>

                    <ReactRough renderer={"svg"} width={250} height={250}>
                        <Rectangle x={10} y={10} width={200} height={200} fill="lightblue" stroke="black" >

                        </Rectangle>
                    </ReactRough>

                    <section className="rough-container">TEST CSS VERSION</section>

                </div>

            </div>
        </div >
    )
}