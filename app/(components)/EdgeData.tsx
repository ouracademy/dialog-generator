"use client";
import { useState, useRef, useEffect } from "react";
import { Button, LinearProgress } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Formik,
  Form,
  Field,
  FormikProps,
} from "formik";
import MenuItem from "@mui/material/MenuItem";
import { Select, TextField, Checkbox } from "formik-mui";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { SelectChangeEvent } from "@mui/material/Select";

interface Values {
  intent: string;
  samples: string;
  isNew: boolean;
}

const EdgeData = ({ setEdgeData, data: edge, handleDelete }: any) => {
  const refForm = useRef<FormikProps<any>>(null);
  const [valueForm, setValueForm] = useState<any>(null);

  const conditions = [
    {
      label: "#afirmacion",
      samples: ["si", "claro", "asi es", "por supuesto"],
    },
    { label: "#negacion", samples: ["no", "de ninguna manera", "no quiero"] },
    { label: "#saludo", samples: ["hola", "hola necesito ayuda"] },
  ];
  useEffect(() => {
    setValueForm({
      intent: edge.data.condition,
      samples: edge.data.samples.join("\n"),
      isNew: false,
    });
  }, [edge, setValueForm]);
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const condition = conditions.filter((c) => c.label == value);
    if (condition) {

      refForm.current?.setFieldValue(
        "samples",
        condition[0]["samples"].join("\n")
      );
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Editar condicion
        </Typography>
        <div className="updateedge__controls">

          {valueForm && (
            <Formik
              innerRef={refForm}
              initialValues={valueForm}
              enableReinitialize={true}
              onSubmit={(values: Values, { setSubmitting }) => {
                console.log("update");

                setSubmitting(false);
             
                console.log(edge);
                setEdgeData({ ...edge, data: { condition: values.intent, samples: values.samples.split("\n")  }});
              }}
            >
              {({ values, submitForm, isSubmitting }) => (
                <Form>
               
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <Field
                      className="full"
                        component={Select}
                        id="intent"
                        name="intent"
                        labelId="condicion"
                        label="Seleccione condicion"
                        onChange={handleChange}
                      >
                        {conditions.map((e, idx) => (
                          <MenuItem key={idx} value={e.label}>
                            {e.label}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid xs={12}>
                      Crear condicion ?
                      <Field
                        component={Checkbox}
                        type="checkbox"
                        name="isNew"
                      />
                    </Grid>
                  </Grid>
                  {values && values.isNew && (
                    <Grid xs={12}>
                      <Field
                        component={TextField}
                        label="Condicion"
                        name="intent"
                      />
                      <br></br>
                      <Field
                        component={TextField}
                        label="Ejemplos"
                        name="samples"
                        multiline
                        maxRows={4}
                      />
                    </Grid>
                  )}

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
          variant="contained"
          color="error"
          onClick={() => handleDelete("edge")}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default EdgeData;
