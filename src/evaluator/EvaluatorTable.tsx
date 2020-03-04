import React from 'react';

interface EvaluatorTableProps {
    result: string
}

const EvaluatorTable: React.FunctionComponent<EvaluatorTableProps> = props => {

    return (
        <table className={'bp3-html-table bp3-html-table-condensed bp3-html-table-striped .bp3-interactive'}>
            <tbody>
            {
                parseResult(props.result).map((row, i) => (
                    <tr key={i}>
                        {
                            row.map((col, j) => (
                                <td key={j}>
                                    { col }
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    );

};

function parseResult (result: string): string[][] {

    if (result[0] === '{' && result[result.length-1] === '}') {

        const text = result.slice(1, -1);
        const rows = text.split(',');
        return rows.map(row => {
            return row.split('->');
        });

    }

    return [];

}

export default EvaluatorTable;
