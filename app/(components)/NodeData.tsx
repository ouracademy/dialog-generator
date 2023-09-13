// "use client";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";

// const NodeData = ({ setNodeName, handleDelete, nodeName }: any) => {
//   return (
//     <Card>
//     <CardContent>
//     <Typography gutterBottom variant="h5" component="div">
//         Editar nodo
//       </Typography>
//       <div className="updatenode__controls">
//         <label>Texto del nodo:</label>
//         <br></br>
//         <input
//           value={nodeName}
//           onChange={(evt) => setNodeName(evt.target.value)}
//         />
//       </div>
//     </CardContent>
//     <CardActions>
//       <Button variant="contained" color="error" onClick={ () => handleDelete('node')}>
//         Eliminar
//       </Button>
//     </CardActions>
//   </Card>
//   );
// };

// export default NodeData;

"use client";
import { useState, useRef, useEffect } from "react";
import { Button, LinearProgress } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Formik, Form, Field, FormikProps } from "formik";

import {  TextField } from "formik-mui";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

interface Values {
  label: string;
  max_retries: Number;
  in_other_case: string;
}

const NodeData = ({ setNodeData, data: node, handleDelete }: any) => {
  const refForm = useRef<FormikProps<any>>(null);
  const [valueForm, setValueForm] = useState<any>(null);

  useEffect(() => {
    setValueForm({
      label: node.data.label,
      max_retries: node.data.max_retries,
      in_other_case: node.data.in_other_case,
    });
  }, [node, setValueForm]);
 
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Editar nodo
        </Typography>
        <br></br>
        <div className="updateedge__controls">
          {valueForm && (
            <Formik
              innerRef={refForm}
              initialValues={valueForm}
              enableReinitialize={true}
              onSubmit={(values: Values, { setSubmitting }) => {
                console.log("update");

                setSubmitting(false);
           
                console.log('data', node);
                setNodeData({...node, data : { label: values.label, max_retries: Number(values.max_retries), in_other_case: values.in_other_case  }});
              }}
            >
              {({ values, submitForm, isSubmitting }) => (
                <Form>
                  <Grid container  direction="column" spacing={2}>
                  <Field
                        component={TextField}
                        label="Texto:"
                        name="label"
                        multiline
                        maxRows={8}
                      />
                      <br></br>
                      <Field
                        component={TextField}
                        label="Max intentos:"
                        name="max_retries"
                        type="number"
                      />
                      <br></br>
                      <Field
                        component={TextField}
                        label="En otro caso:"
                        name="in_other_case"
                        multiline
                        maxRows={4}
                      />
                 
                  </Grid>

                  {isSubmitting && <LinearProgress />}
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Guardar
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete("node")}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default NodeData;
