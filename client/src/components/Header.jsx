import WorkflowStatus from "./WorkflowStatus";

function Header(props) {
    return (
        <div className="header">
            <h3 id="contract">Contract: {props.contractAddress}</h3>
            <h3 id="account">Account: {props.userAccount}</h3>
            <WorkflowStatus userAccount={props.userAccount} contract={props.contract} />
        </div>
    )
}

export default Header;