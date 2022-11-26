import { useEffect, useState } from "react";

type UseScrollspyProps = {
    rootMargin?:string;
    threshold?:number|number[];
    root?:Element|null;
}

function useScrollspy(ids:number[]|string[], {rootMargin="-50% -50%", threshold = 0, root = null}:UseScrollspyProps = {}) {
    
    const [activeIdsSet, setActiveIdsSet] = useState<{idsSet:Set<string|number>|null}>({idsSet:null});

    useEffect(() => {

        const options = {rootMargin, threshold, root};
        const idsSet = new Set<string|number>(ids);

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {

            entries.forEach((entry) => {
                if(entry.isIntersecting){
                    idsSet.add(entry.target.id);
                }else{
                    idsSet.delete(entry.target.id);
                }
            });

            setActiveIdsSet({idsSet});
        };

        const interserctionObserver = new IntersectionObserver(handleIntersection, options);

        ids.forEach((id) => {
            const element = document.querySelector(`#${id}`);
            if(element){
                interserctionObserver.observe(element);
            }
        });

        return () => interserctionObserver.disconnect();

    }, [threshold, rootMargin, root, ids]);

    return activeIdsSet.idsSet??new Set();
}

export default useScrollspy;