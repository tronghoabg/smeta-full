import { useState, useEffect, useRef } from 'react'
import './dropdown.scss'

const Dropdown = (props) => {
    const { setSelected, options } = props
    const [isActive, setActive] = useState(false);
    const [search, setSearch] = useState('-')
    const dropRef = useRef(null);


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropRef.current) {
                if (!dropRef.current.contains(event.target)) {
                    setActive(false);
                }
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isActive]);

    const showDropdown = () => {
        setSearch('')
        setActive(true)
    }

    const changeSearch = (keyword) => {
        setSearch(keyword)
        setActive(true)
    }


    return (
        <div className="dropdown">
            <div className="dropdown-btn"
                ref={dropRef}
                onClick={showDropdown}
            >
                <input value={search} type='text' onChange={(e) => changeSearch(e.target.value)} />
                <i className="fa-solid fa-chevron-down"></i>
            </div>
            {isActive &&
                <div className="dropdown-content">
                    {options.filter((item) => {
                        var keyword = search.toLocaleLowerCase()
                        return keyword === '' ? item : (item.label.toLocaleLowerCase().includes(keyword) || item.value.includes(keyword))
                    }).map((option, index) => (
                        <div className="dropdown-item"
                            key={index}
                            onClick={(e) => {
                                setSelected(option.value)
                                setActive(false)
                                setSearch(option.label)
                            }}
                        >{option.label}</div>
                    )
                    )}

                </div>
            }
        </div>
    )
}
export default Dropdown