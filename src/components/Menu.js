import React from "react"
import styled from "styled-components"
import * as R from "ramda"
import { VerticalLign } from "./Fancy"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"

const ActiveLignContainer = styled.div`
    margin-left: 20px;
`

const ActiveLignPositioner = styled.div`
    position: relative;
    height: ${p => 1 / p.amount * 100}%;
    width: 1px;
    top: ${p => (1 / p.amount) * p.active * 100}%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: top 1s;
`

const ActualActiveLign = styled(VerticalLign)`
    height: 80%;
`

const ActiveLign = ({links, activeLink}) => (
    <ActiveLignContainer>
        <ActiveLignPositioner amount={links.length} active={links.findIndex(l => l.path == activeLink)}>
            <ActualActiveLign />
        </ActiveLignPositioner>
    </ActiveLignContainer>
)

const MenuContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
`

const MenuItem = ({children, onClick}) => (
    <MenuContainer>
        <MenuText onClick={onClick}>{children}</MenuText>
    </MenuContainer>
)

const MenuText = styled.div`
    font-size: 13pt;
    padding: 20px;
    text-align: right;
    
    :hover
    {
        cursor: pointer;
    }
`

const Menu = withRouter(({links, location }) => (
    <MenuContainer>
        <div>
            {links.map(l => 
                <Link to={l.path} key={l.path} style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuText>
                        {l.name}
                    </MenuText>
                </Link>
            )}
        </div>
        <VerticalLign />
        <ActiveLign links={links} activeLink={location.pathname} />
    </MenuContainer>
))

export default Menu