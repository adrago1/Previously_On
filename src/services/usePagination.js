import { useMemo } from "react";

const range = (start, end) => {
    let length = end - start + 1;
    /* Tableau de taille non définie qui set les 
    elements à l'intérieur de la value de départ à 
    la valeur de fin
    */

    return Array.from({ length }, (_, idx) => idx + start);
}

export const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount /  pageSize);

        const totalPageNumbers = siblingCount + 5;

        /* 
        Cas 1 :  Nombre de page inférieur au nombre 
        de pages qu'on veut afficher dans notre
        Pagination, on return [1...totalpage]
        */
       if (totalPageNumbers >= totalPageCount) {
           return range(1, totalPageCount);
       }
       // Met à jour les pages côte a côte 
       const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
       const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

       // Cacher les points quand il y a seulement une page
       const shouldShowLeftDots = leftSiblingIndex > 2;
       const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

       const firstPageIndex = 1;
       const lastPageIndex = totalPageCount;

        /*
        Case 2: Pas de points à droite, mais points à gauche
        */
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, "...", totalPageCount];
        }

        /*
        Cas 3: Inverse du cas 2
        */
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1, totalPageCount
            );
            return [firstPageIndex, "...", ...rightRange];
        }

        /*
        Cas 4: Montrer les points des deux côtés
        */
       if (shouldShowLeftDots && shouldShowRightDots) {
           let middleRange = range(leftSiblingIndex, rightSiblingIndex);
           return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
       }

    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
}