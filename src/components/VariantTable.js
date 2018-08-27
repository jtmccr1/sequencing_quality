import React from 'react';
import JsonTable from 'ts-react-json-table';

const VariantTable = ({ data }) => {
	return <JsonTable rows={data} />;
};

export default VariantTable;
