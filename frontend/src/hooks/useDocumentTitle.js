import React, { useEffect, useState } from 'react'

const useDocumentTitle = (title) => {
    const [documentTitle, setDocumentTitle] = useState(title);

    useEffect(() => {
        document.title = documentTitle;
    }, [])

    return [documentTitle, setDocumentTitle];

}

export { useDocumentTitle };